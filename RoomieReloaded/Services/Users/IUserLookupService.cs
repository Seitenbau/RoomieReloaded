using Ical.Net.DataTypes;
using JetBrains.Annotations;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Users;

public interface IUserLookupService
{
    [NotNull]
    Task<IUser> GetUserAsync([NotNull] Organizer organizer);
}