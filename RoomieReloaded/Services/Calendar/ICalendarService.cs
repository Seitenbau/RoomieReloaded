using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieReloaded.Models;
using RoomieReloaded.Models.Calendar;

namespace RoomieReloaded.Services.Calendar
{
	public interface ICalendarService
	{
		Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(string roomEmail, DateTime from, DateTime to);
	}
}