using Ical.Net.DataTypes;
using Novell.Directory.Ldap;
using RoomieReloaded.Extensions;

namespace RoomieReloaded.Models.Users;

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

    public static User FromLdapEntry(LdapEntry ldapEntry)
    {
            
        return new User
        {
            DisplayName = ldapEntry.GetAttribute("name").StringValue,
            FirstName = ldapEntry.GetAttribute("givenname").StringValue,
            UserName = ldapEntry.GetAttribute("samaccountname").StringValue,
            MailAddress = ldapEntry.GetAttribute("mail").StringValue
        };
    }
}