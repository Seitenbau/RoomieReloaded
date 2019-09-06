using Ical.Net.DataTypes;
using RoomieReloaded.Models;

namespace RoomieReloaded.Services.CalendarEvents
{
    public interface ICalendarEventFactory
    {
        ICalendarEvent CreateFromOccurence(Occurrence occurrence);
    }
}