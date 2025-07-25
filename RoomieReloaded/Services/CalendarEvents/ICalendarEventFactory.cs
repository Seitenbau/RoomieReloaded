using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Services.CalendarEvents;

public interface ICalendarEventFactory
{
    Task<ICalendarEvent> CreateFromOccurenceAsync(Occurrence occurrence, IRoom room);

    ICalendarEvent CreateErrorEvent(Occurrence occurrence, IRoom room, string error);

    bool IsPrivateEvent(CalendarEvent calendarEvent);
}