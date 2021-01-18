using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Services.CalendarEvents;
using RoomieReloaded.Services.Rooms;
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

        public async Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(IRoom room, DateTime @from,
            DateTime to)
        {
            var icsCalendar = await _zimbraAdapter.GetRoomCalendarAsIcsStringAsync(room.Name, from, to);

            var calendar = Ical.Net.Calendar.Load(icsCalendar);

            var eventOccurrences = calendar?.GetOccurrences(from, to)
                ?.ToList() ?? new List<Occurrence>();

            var events = await CreateCalendarEventsAsync(eventOccurrences, room);

            return events;
        }

        private async Task<IEnumerable<ICalendarEvent>> CreateCalendarEventsAsync(
            IEnumerable<Occurrence> eventOccurrences, IRoom room)
        {
            var tasks = eventOccurrences.Where(occ => IsValidOccurence(occ, room))
                .Select(occ => _calendarEventFactory.CreateFromOccurenceAsync(occ, room));

            var taskArray = tasks.ToArray();

            await Task.WhenAll(taskArray);

            return taskArray.Select(t => t.Result);
        }

        private bool IsValidOccurence(Occurrence occurrence, IRoom room)
        {
            var calendarEvent = (CalendarEvent) occurrence.Source;

            if (calendarEvent.Organizer?.Value.AbsoluteUri.Contains(room.Mail) ?? false)
            {
                // resources, that appear as organizer for their own events, are always valid, as the resource was actively planned
                return true;
            }

            if (calendarEvent.Attendees?.Any(att => IsAcceptedRoomAttendee(att, room.Name)) ?? false)
            {
                // check if the room has accepted the appointment. if it hasn't, an appointment was created although there already was another appointment
                return true;
            }

            if (_calendarEventFactory.IsPrivateEvent(calendarEvent))
            {
                //we don't get attendee information for private appointments, so we have to assume the appointment is accepted
                return true;
            }

            return false;
        }

        private bool IsAcceptedRoomAttendee(Attendee attendee, string roomName)
        {
            return attendee.Value.UserInfo.Equals(roomName) &&
                   attendee.ParticipationStatus.Equals(Constants.IcsConstants.AcceptedParticipationStatus);
        }
    }
}