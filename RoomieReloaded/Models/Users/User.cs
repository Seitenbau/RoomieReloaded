using System.DirectoryServices.Protocols;
using Ical.Net.DataTypes;
using RoomieReloaded.Extensions;

namespace RoomieReloaded.Models.Users
{
    public class User : IUser
    {
        private User()
        {
        }

        public string DisplayName { get; private set; }

        public string FirstName { get; private set; }

        public string UserName { get; private set; }

        public string MailAddress { get; private set; }

        public static User FromOrganizer(Organizer organizer)
        {
            return new User
            {
                DisplayName = organizer.GetDisplayName(),
                FirstName = organizer.GetDisplayName(),
                MailAddress = organizer.GetEmailAddress()
            };
        }

        public static User FromLdapEntry(SearchResultEntry ldapSearchResult)
        {
            return new User
            {
                DisplayName = ldapSearchResult.Attributes["name"][0].ToString(),
                FirstName = ldapSearchResult.Attributes["givenname"][0].ToString(),
                UserName = ldapSearchResult.Attributes["samaccountname"][0].ToString(),
                MailAddress = ldapSearchResult.Attributes["mail"][0].ToString(),
            };
        }
    }
}