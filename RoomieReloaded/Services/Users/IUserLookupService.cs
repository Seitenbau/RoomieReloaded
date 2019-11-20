using Ical.Net.DataTypes;
using JetBrains.Annotations;
using RoomieReloaded.Models;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users
{
    public interface IUserLookupService
    {
        [NotNull]
        IUser GetUser([NotNull] Organizer organizer);
    }
}