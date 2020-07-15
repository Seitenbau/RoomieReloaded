using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Services.CalendarEvents
{
    public interface ICalendarEventFactory
    {
        Task<ICalendarEvent> CreateFromOccurenceAsync(Occurrence occurrence, IRoom room);

        bool IsPrivateEvent(CalendarEvent calendarEvent);
    }
}