using System.Threading.Tasks;
using JetBrains.Annotations;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Services.Accessors;

public interface IRoomAccessor
{
    /// <summary>
    /// Gets the room the matching the current requests. May only be used in a context where the room is known. Will fail otherwise.
    /// </summary>
    /// <returns>The room the current requests is handling</returns>
    [NotNull]
    [ItemNotNull]
    Task<IRoom> GetCurrentRoomAsync();
}