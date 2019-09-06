using System.Collections.Generic;
using System.Threading.Tasks;

namespace RoomieReloaded.Services.Rooms
{
	public interface IRoomService
	{
		Task<IRoom> GetRoomByNameAsync(string roomName);

        Task<IEnumerable<IRoom>> GetAllRoomsAsync();
	}

	public interface IRoom
	{
		string NiceName { get; }

		string Name { get; }

		string Mail { get; }
	}
}