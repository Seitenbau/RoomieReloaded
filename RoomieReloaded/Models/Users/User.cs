using System.DirectoryServices.AccountManagement;
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

        public static User FromUserPrincipal(UserPrincipal userPrincipal)
        {
            return new User
            {
                DisplayName = userPrincipal.Name,
                FirstName = userPrincipal.GivenName,
                UserName = userPrincipal.SamAccountName,
                MailAddress = userPrincipal.EmailAddress
            };
        }
    }
}