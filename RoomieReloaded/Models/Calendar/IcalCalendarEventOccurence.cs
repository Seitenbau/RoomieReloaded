using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;

namespace RoomieReloaded.Models.Calendar;

public class IcalCalendarEventOccurence : ICalendarEventOccurence
{
    public IcalCalendarEventOccurence([NotNull] Occurrence occurrence, bool isPrivateEvent, bool showSubject, bool hasError, string sentBy)
    {
        IsPrivateEvent = isPrivateEvent;
        var calendarEvent = (CalendarEvent) occurrence.Source;
        EventId = $"{calendarEvent.Uid}-{occurrence.Period}";
        ShowSubject = showSubject;
        Subject = calendarEvent.Summary;
        From = occurrence.Period.StartTime.AsUtc;
        To = occurrence.Period.EndTime.AsUtc;
        HasError = hasError;
        SentBy = sentBy;
    }
    public bool IsPrivateEvent { get; }
    public string EventId { get; }
    public bool ShowSubject { get; }
    public string Subject { get; }
    public DateTime From { get; }
    public DateTime To { get; }

    public bool HasError {get;set;}
    public string SentBy {get;set;}
}