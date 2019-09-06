using JetBrains.Annotations;

namespace RoomieReloaded.Models
{
    public interface IUser
    {
        [NotNull] 
        string FullName { get; }

        string MailAddress { get; }
    }
}