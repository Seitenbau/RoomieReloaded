using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using JetBrains.Annotations;

namespace RoomieReloaded.Models.Calendar;

public class IcalCalendarEventOccurence : ICalendarEventOccurence
{
    public IcalCalendarEventOccurence([NotNull] Occurrence occurrence, bool isPrivateEvent, bool showSubject)
    {
        IsPrivateEvent = isPrivateEvent;
        var calendarEvent = (CalendarEvent) occurrence.Source;
        EventId = $"{calendarEvent.Uid}-{occurrence.Period}";
        ShowSubject = showSubject;
        Subject = calendarEvent.Summary;
        From = occurrence.Period.StartTime.AsUtc;
        To = occurrence.Period.EndTime.AsUtc;
    }
    public bool IsPrivateEvent { get; }
    public string EventId { get; }
    public bool ShowSubject { get; }
    public string Subject { get; }
    public DateTime From { get; }
    public DateTime To { get; }
}