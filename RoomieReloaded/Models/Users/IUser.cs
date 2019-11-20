using JetBrains.Annotations;

namespace RoomieReloaded.Models.Users
{
    public interface IUser
    {
        [NotNull] 
        string DisplayName { get; }

        [NotNull]
        string FirstName { get; }

        [CanBeNull]
        string UserName { get; }
        
        [CanBeNull]
        string MailAddress { get; }
    }
}