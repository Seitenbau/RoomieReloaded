using System;

namespace RoomieReloaded.Models
{
    public interface ICalendarEvent
    {
        string Id { get; }
        
        string Name { get; }

        string Organizer { get; }

        DateTime From { get; }

        DateTime To { get; }
    }
}