using Ical.Net.DataTypes;
using JetBrains.Annotations;
using Microsoft.IdentityModel.Tokens;
using RoomieReloaded.Models;

namespace RoomieReloaded.Services.Users
{
    public interface IUserLookupService
    {
        [NotNull]
        IUser GetUser([NotNull] Organizer organizer);
    }
}