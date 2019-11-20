using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using RoomieReloaded.Models.Calendar;
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

            var eventOccurrences = calendar.GetOccurrences(from, to)
                .ToList();

            var events = await CreateCalendarEventsAsync(eventOccurrences, roomEmail);

            return events;
        }

        private async Task<IEnumerable<ICalendarEvent>> CreateCalendarEventsAsync(
            IEnumerable<Occurrence> eventOccurrences, string roomEmail)
        {
            var tasks = eventOccurrences.Where(occ => IsValidOccurence(occ, roomEmail))
                .Select(_calendarEventFactory.CreateFromOccurenceAsync);

            var taskArray = tasks.ToArray();

            await Task.WhenAll(taskArray);

            return taskArray.Select(t => t.Result);
        }

        private bool IsValidOccurence(Occurrence occurrence, string roomEmail)
        {
            var calendarEvent = (CalendarEvent) occurrence.Source;
            return calendarEvent.Attendees.Any(att => IsAcceptedAttendee(att, roomEmail));
        }

        private bool IsAcceptedAttendee(Attendee attendee, string roomEmail)
        {
            return attendee.Value.UserInfo.Equals(roomEmail) && attendee.ParticipationStatus.Equals("ACCEPTED");
        }
    }
}