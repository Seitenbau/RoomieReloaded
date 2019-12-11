using System;
using System.DirectoryServices.Protocols;
using System.Threading.Tasks;
using Ical.Net.DataTypes;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;
using RoomieReloaded.Extensions;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users
{
    public class LdapUserLookupService : IUserLookupService
    {
        private readonly IOptions<LdapConfiguration> _ldapConfiguration;
        private readonly ILogger<LdapUserLookupService> _logger;

        public LdapUserLookupService(IOptions<LdapConfiguration> ldapConfiguration,
            ILogger<LdapUserLookupService> logger)
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
            return IsValidLdapConfig();
        }

        private bool IsValidLdapConfig()
        {
            return _ldapConfiguration?.Value != null && _ldapConfiguration.Value.Validate();
        }

        private Task<IUser> SearchOrganizerAsync(Organizer organizer)
        {
            var taskCompletionSource = new TaskCompletionSource<IUser>();
            var connection = OpenConnection();

            var requestState = new SearchRequestState(connection, taskCompletionSource, organizer);

            var searchRequest = new SearchRequest(_ldapConfiguration.Value.SearchBase,
                requestState.Filter,
                SearchScope.Subtree,
                null);
            connection.BeginSendRequest(searchRequest, PartialResultProcessing.ReturnPartialResultsAndNotifyCallback,
                CompleteUserSearch, requestState);

            return taskCompletionSource.Task;
        }

        private void CompleteUserSearch(IAsyncResult asyncResult)
        {
            var requestState = (SearchRequestState) asyncResult.AsyncState;

            try
            {
                CompleteUserSearch(asyncResult, requestState);
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error searching for an LDAP with the filter '{requestState.Filter}'");
                requestState.SetNoResult();
            }
            finally
            {
                requestState.Connection.Dispose();
                asyncResult.AsyncWaitHandle.Close();
                asyncResult.AsyncWaitHandle.Dispose();
            }
        }

        private void CompleteUserSearch(IAsyncResult asyncResult, SearchRequestState requestState)
        {
            asyncResult.AsyncWaitHandle.WaitOne(_ldapConfiguration.Value.TimeoutInMilliseconds);
            var result = (SearchResponse) requestState.Connection.EndSendRequest(asyncResult);

            if (result.Entries.Count == 0)
            {
                _logger.LogTrace($"Could not find an LDAP user with the filter '{requestState.Filter}'");
                requestState.SetNoResult();
                return;
            }

            if (result.Entries.Count > 1)
            {
                _logger.LogWarning(
                    $"Found multiple LDAP users with the filter '{requestState.Filter}'. Assuming first hit is correct.");
            }

            var entry = result.Entries[0];
            var user = User.FromLdapEntry(entry);
            requestState.SetResult(user);
        }

        private class SearchRequestState
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
        }

        [NotNull]
        private LdapConnection OpenConnection()
        {
            var credentials = _ldapConfiguration.Value.CreateCredentials();
            var serverId = _ldapConfiguration.Value.CreateIdentifier();

            var connection = new LdapConnection(serverId, credentials);
            connection.Bind();

            return connection;
        }
    }
}