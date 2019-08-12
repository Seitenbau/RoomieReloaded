using System;
using System.Threading.Tasks;

namespace RoomieReloaded.Services
{
	public interface IZimbraAdapter
	{
		Task<string> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end);
	}
}