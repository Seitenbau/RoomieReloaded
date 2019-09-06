using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RoomieReloaded.Services.Calendar
{
	public interface ICalendarService
	{
		Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(string roomEmail, DateTime from, DateTime to);
	}

	public interface ICalendarEvent
	{
        string Id { get; }
        
		string Name { get; }

		string Organizer { get; }

		DateTime From { get; }

		DateTime To { get; }
	}
}