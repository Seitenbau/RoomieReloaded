using Microsoft.AspNetCore.Mvc;

namespace RoomieReloaded.Services.Zimbra;

public interface IZimbraAdapter
{
	Task<IActionResult> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end);
}