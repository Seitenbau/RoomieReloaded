using Ical.Net.DataTypes;
using JetBrains.Annotations;
using Microsoft.Extensions.Options;
using Novell.Directory.Ldap;
using RoomieReloaded.Configuration;
using RoomieReloaded.Extensions;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users
{
    public class LdapUserLookupService : IUserLookupService
    {
        private readonly IOptions<LdapConfiguration> _ldapConfiguration;

        public LdapUserLookupService(IOptions<LdapConfiguration> ldapConfiguration)
        {
            _ldapConfiguration = ldapConfiguration;
        }

        public IUser GetUser(Organizer organizer)
        {
            IUser user = null;
            if (organizer.HasCommonName())
            {
                user = GetUserByName(organizer.CommonName);
            }
            else if (organizer.HasEmailAddress())
            {
                var mailAddress = organizer.GetEmailAddress();
                user = GetUserByMail(mailAddress);
            }

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

        private IUser GetUserByName(string name)
        {
            using (var connection = OpenConnection())
            {
                var searchResult = connection?.Search("OU=user,OU=agentur,OU=seitenbau,dc=seitenbau,dc=net",
                    LdapConnection.SCOPE_SUB,
                    $"(&((&(objectCategory=Person)(objectClass=User)))(name={name}))",
                    new[] {"name", "givenname", "samacccountname", "mail"},
                    false);

                return GetUserFromSearchResult(searchResult);
            }
        }

        private IUser GetUserByMail(string mail)
        {
            using (var connection = OpenConnection())
            {
                var searchResult = connection?.Search("OU=seitenbau,DC=seitenbau,DC=net",
                    LdapConnection.SCOPE_SUB,
                    $"(&((&(objectCategory=Person)(objectClass=User)))(mail={mail}))",
                    new[] {"name", "givenname", "samacccountname", "mail"},
                    false);

                return GetUserFromSearchResult(searchResult);
            }
        }

        [CanBeNull]
        private static IUser GetUserFromSearchResult([CanBeNull] LdapSearchResults searchResult)
        {
            if (searchResult == null)
            {
                return null;
            }

            if (searchResult.Count == 0)
            {
                return null;
            }

            var entry = searchResult.next();
            return User.FromLdapEntry(entry);
        }

        [CanBeNull]
        private LdapConnection OpenConnection()
        {
            if (!UseLdap())
            {
                return null;
            }

            var connection = new LdapConnection();
            connection.Connect(_ldapConfiguration.Value.Host, _ldapConfiguration.Value.Port);
            connection.Bind(_ldapConfiguration.Value.UserName, _ldapConfiguration.Value.Password);
            return connection;
        }
    }
}