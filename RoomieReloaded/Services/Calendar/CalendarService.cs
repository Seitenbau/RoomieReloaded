using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Logging;
using RoomieReloaded.Models;
using RoomieReloaded.Services.CalendarEvents;
using RoomieReloaded.Services.Zimbra;

namespace RoomieReloaded.Services.Calendar
{
    public class CalendarService : ICalendarService
    {
        private readonly IZimbraAdapter _zimbraAdapter;
        private readonly ICalendarEventFactory _calendarEventFactory;

        public CalendarService(IZimbraAdapter zimbraAdapter, ICalendarEventFactory calendarEventFactory)
        {
            _zimbraAdapter = zimbraAdapter;
            _calendarEventFactory = calendarEventFactory;
        }

        public async Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(string roomEmail, DateTime from,
            DateTime to)
        {
            var icsCalendar = await _zimbraAdapter.GetRoomCalendarAsIcsStringAsync(roomEmail, from, to);

            var calendar = Ical.Net.Calendar.Load(icsCalendar);

            var eventOccurrences = calendar.GetOccurrences(from, to);

            var events = CreateCalendarEvents(eventOccurrences, roomEmail);

            return events;
        }

        private IEnumerable<ICalendarEvent> CreateCalendarEvents(
            HashSet<Occurrence> eventOccurrences, string roomEmail)
        {
            foreach (var occurence in eventOccurrences)
            {
                var calendarEvent = (CalendarEvent) occurence.Source;
                // Show Only events that overlap with from and to
                if (calendarEvent.Attendees.Any(att =>
                    att.Value.UserInfo.Equals(roomEmail) && att.ParticipationStatus.Equals("ACCEPTED")))
                {
                    yield return _calendarEventFactory.CreateFromOccurence(occurence);
                }
            }
        }
    }
}