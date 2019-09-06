using Ical.Net.DataTypes;
using RoomieReloaded.Extensions;

namespace RoomieReloaded.Models
{
    public class User : IUser
    {
        public User(string fullName, string mailAddress)
        {
            FullName = fullName ?? string.Empty;
            MailAddress = mailAddress;
        }

        public User(Organizer organizer)
        {
            FullName = organizer.GetDisplayName() ?? string.Empty;
            MailAddress = organizer.GetEmailAddress();
        }

        public string FullName { get; }
        public string MailAddress { get; }
    }
}