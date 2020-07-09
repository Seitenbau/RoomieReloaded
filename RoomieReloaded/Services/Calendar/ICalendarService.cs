using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieReloaded.Models;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Services.Calendar
{
	public interface ICalendarService
	{
		Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(IRoom room, DateTime @from, DateTime to);
	}
}