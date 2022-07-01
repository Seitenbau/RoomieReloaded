namespace RoomieReloaded.Services.Zimbra;

public interface IZimbraAdapter
{
	Task<string> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end);
}