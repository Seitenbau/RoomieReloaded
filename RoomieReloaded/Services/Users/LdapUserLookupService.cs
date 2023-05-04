using Ical.Net.DataTypes;
using Microsoft.Extensions.Options;
using Novell.Directory.Ldap;
using RoomieReloaded.Configuration;
using RoomieReloaded.Extensions;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users;

public class LdapUserLookupService : IUserLookupService
{
    [NotNull] private readonly IOptions<LdapConfiguration> _ldapConfiguration;
    [NotNull] private readonly ILogger<LdapUserLookupService> _logger;

    public LdapUserLookupService(
        [NotNull] IOptions<LdapConfiguration> ldapConfiguration,
        [NotNull] ILogger<LdapUserLookupService> logger)
    {
        _ldapConfiguration = ldapConfiguration;
        _logger = logger;
    }

    public async Task<IUser> GetUserAsync(Organizer organizer)
    {
        if (!UseLdap())
        {
            return User.FromOrganizer(organizer);
        }

        var user = await SearchOrganizerAsync(organizer);

        return user ?? User.FromOrganizer(organizer);
    }

    private bool UseLdap()
    {
        return IsValidLdapConfig() && this._ldapConfiguration.Value!.UseLdap;
    }

    private bool IsValidLdapConfig()
    {
        return _ldapConfiguration.Value != null && _ldapConfiguration.Value.Validate();
    }

    [NotNull]
    private Task<IUser> SearchOrganizerAsync(Organizer organizer)
    {
        var taskCompletionSource = new TaskCompletionSource<IUser>();
        var connection = OpenConnection();

        var requestState = new SearchRequestState(connection, taskCompletionSource, organizer);

        Task.Run(() => ExecuteSearchSafe(requestState));

        return taskCompletionSource.Task;
    }

    private void ExecuteSearchSafe(SearchRequestState requestState)
    {
        try
        {
            var searchQueue = StartUserSearch(requestState);
            CompleteUserSearch(requestState, searchQueue);
        }
        catch (Exception e)
        {
            _logger.LogError(e, $"Error searching for an LDAP with the filter '{requestState.Filter}'");
            requestState.SetNoResult();
        }
        finally
        {
            requestState.Dispose();
        }
    }

    private LdapSearchQueue StartUserSearch(SearchRequestState requestState)
    {
        var searchConstraints =
            new LdapSearchConstraints(_ldapConfiguration.Value.TimeoutInMilliseconds,
                _ldapConfiguration.Value.TimeoutInSeconds,
                LdapSearchConstraints.DerefNever,
                1,
                true,
                1,
                null,
                20);
        var attributes = new[] {"name", "givenname", "samaccountname", "mail"};
        var searchQueue = requestState.Connection.Search(_ldapConfiguration.Value.SearchBase,
            LdapConnection.ScopeSub,
            requestState.Filter,
            attributes,
            false,
            null,
            searchConstraints);
        return searchQueue;
    }

    private void CompleteUserSearch(SearchRequestState requestState, LdapMessageQueue searchQueue)
    {
        var response = searchQueue.GetResponse();
        if (!(response is LdapSearchResult searchResult))
        {
            _logger.LogTrace($"Received an unexpected result of type '{response?.GetType()}' from LDAP search.");
            requestState.SetNoResult();
            return;
        }

        if (searchResult.Entry == null)
        {
            _logger.LogTrace($"Could not find an LDAP user with the filter '{requestState.Filter}'");
            requestState.SetNoResult();
            return;
        }

        var user = User.FromLdapEntry(searchResult.Entry);
        requestState.SetResult(user);
    }

    private sealed class SearchRequestState : IDisposable
    {
        private readonly TaskCompletionSource<IUser> _taskCompletionSource;
        private readonly Organizer _organizer;

        public SearchRequestState(LdapConnection connection,
            TaskCompletionSource<IUser> taskCompletionSource,
            Organizer organizer)
        {
            Connection = connection;
            _taskCompletionSource = taskCompletionSource;
            _organizer = organizer;
            Filter = BuildFilter();
        }

        public LdapConnection Connection { get; }

        public string Filter { get; }

        public void SetNoResult()
        {
            _taskCompletionSource.SetResult(null);
        }

        public void SetResult(IUser user)
        {
            _taskCompletionSource.SetResult(user);
        }

        private string BuildFilter()
        {
            var nameFilter = _organizer.HasCommonName()
                ? $"(name={_organizer.CommonName})"
                : string.Empty;
            var mailFilter = _organizer.HasEmailAddress()
                ? $"(mail={_organizer.GetEmailAddress()})"
                : string.Empty;

            return $"(|{nameFilter}{mailFilter})";
        }

        public void Dispose()
        {
            Connection?.Dispose();
        }
    }

    [NotNull]
    private LdapConnection OpenConnection()
    {
        var connection = new LdapConnection();
        try
        {
            connection.Connect(_ldapConfiguration.Value.Host, _ldapConfiguration.Value.Port);
            connection.Bind(_ldapConfiguration.Value.UserName, _ldapConfiguration.Value.Password);
        }
        catch (Exception e)
        {
            this._logger.LogError(e, "Could not open a connection to LDAP");
        }

        return connection;
    }
}