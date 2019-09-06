using System;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;

namespace RoomieReloaded.Models
{
    public class RoomieCalendarEvent : ICalendarEvent
    {
        public RoomieCalendarEvent(Occurrence occurence)
        {
            CalendarEvent calendarEvent = (CalendarEvent) occurence.Source;
            Id = $"{calendarEvent.Uid}-{occurence.Period}";
            Organizer = calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.UserInfo ?? string.Empty;

            From = occurence.Period.StartTime.AsUtc;
            To = occurence.Period.EndTime.AsUtc;

            // TODO is Summary allowed to be shown publicly?
            Name = string.Empty; // calendarEvent.Summary;
        }

        public string Id { get; }
        public string Name { get; }
        public string Organizer { get; }
        public DateTime From { get; }
        public DateTime To { get; }
    }
}