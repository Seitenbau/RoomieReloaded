using System;
using System.Collections.Generic;
using System.Linq;
using RoomieReloaded.Services;
using RoomieReloaded.Services.Calendar;

namespace RoomieReloaded.Models
{
	public class CalendarRoomModel
	{
		public CalendarRoomModel(string groupId, string room, IEnumerable<CalendarEventModel> events)
		{
			Room = room;
			GroupId = groupId;
			Events = events.ToList();
		}

		public string GroupId { get; }

		public string Room { get; }

		public List<CalendarEventModel> Events { get; }
	}

    public class CalendarEventModel
    {
        public CalendarEventModel(string id, string name, string organizer, DateTime start, DateTime end)
        {
            Id = id;
            Name = name;
            Organizer = organizer;
            Start = start;
            End = end;
        }

        public string Id {get; }

		public string Name { get; }

		public string Organizer { get; }

		public DateTime Start { get; }

		public DateTime End { get; }

		public static CalendarEventModel FromCalendarEvent(ICalendarEvent ev)
		{
			if (ev == null)
			{
				throw new ArgumentNullException(nameof(ev));
			}
			return new CalendarEventModel(ev.Id, ev.Name, ev.Organizer, ev.From, ev.To);
		}
	}
}