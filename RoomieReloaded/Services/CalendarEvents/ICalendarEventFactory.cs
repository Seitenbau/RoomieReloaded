using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using RoomieReloaded.Models.Calendar;

namespace RoomieReloaded.Services.CalendarEvents
{
    public interface ICalendarEventFactory
    {
        Task<ICalendarEvent> CreateFromOccurenceAsync(Occurrence occurrence);

        bool IsPrivateEvent(CalendarEvent calendarEvent);
    }
}