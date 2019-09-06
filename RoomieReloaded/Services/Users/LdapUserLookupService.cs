using System.DirectoryServices.AccountManagement;
using Ical.Net.DataTypes;
using JetBrains.Annotations;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;
using RoomieReloaded.Extensions;
using RoomieReloaded.Models;

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

            return user ?? new User(organizer);
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
            using (var context = CreateContext())
            {
                using (var searchPrincipal = new UserPrincipal(context))
                {
                    searchPrincipal.Name = name;
                    return SearchUser(searchPrincipal);
                }
            }
        }

        private IUser GetUserByMail(string mail)
        {
            using (var context = CreateContext())
            {
                using (var searchPrincipal = new UserPrincipal(context))
                {
                    searchPrincipal.EmailAddress = mail;
                    return SearchUser(searchPrincipal);
                }
            }
        }

        private PrincipalContext CreateContext()
        {
            const ContextOptions options = ContextOptions.Negotiate | ContextOptions.Sealing | ContextOptions.Signing;
            return new PrincipalContext(ContextType.Domain,
                _ldapConfiguration.Value.Domain,
                null,
                options,
                _ldapConfiguration.Value.UserName,
                _ldapConfiguration.Value.Password);
        }

        [CanBeNull]
        private IUser SearchUser(Principal searchPrincipal)
        {
            if (!UseLdap())
            {
                return null;
            }

            using (var searcher = new PrincipalSearcher(searchPrincipal))
            {
                if (searcher.FindOne() is UserPrincipal user)
                {
                    return new User(user.Name, user.EmailAddress);
                }
            }

            return null;
        }
    }
}