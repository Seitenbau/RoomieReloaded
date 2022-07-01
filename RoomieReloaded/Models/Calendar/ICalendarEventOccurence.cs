using System;

namespace RoomieReloaded.Models.Calendar;

public interface ICalendarEventOccurence
{
    bool IsPrivateEvent { get; }

    string EventId { get; }

    bool ShowSubject { get; }

    string Subject { get; }

    DateTime From { get; }

    DateTime To { get; }
}