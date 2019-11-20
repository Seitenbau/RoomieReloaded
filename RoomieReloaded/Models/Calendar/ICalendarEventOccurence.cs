using System;

namespace RoomieReloaded.Models.Calendar
{
    public interface ICalendarEventOccurence
    {
        string EventId { get; }

        DateTime From { get; }

        DateTime To { get; }
    }
}