using System;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using JetBrains.Annotations;

namespace RoomieReloaded.Models.Calendar
{
    public class IcalCalendarEventOccurence : ICalendarEventOccurence
    {

        public IcalCalendarEventOccurence([NotNull] Occurrence occurence, bool isPrivateEvent)
        {
            IsPrivateEvent = isPrivateEvent;
            var calendarEvent = (CalendarEvent) occurence.Source;
            EventId = $"{calendarEvent.Uid}-{occurence.Period}";
            From = occurence.Period.StartTime.AsUtc;
            To = occurence.Period.EndTime.AsUtc;
        }
        public bool IsPrivateEvent { get; }
        public string EventId { get; }
        public DateTime From { get; }
        public DateTime To { get; }
    }
}