using System;

namespace RoomieReloaded.Models.Calendar
{
    public interface ICalendarEvent
    {
        string Id { get; }
        
        string Name { get; }

        string Organizer { get; }

        DateTime From { get; }

        DateTime To { get; }

        string ChatWithOrganizerLink { get; }

        string ChatMessageTemplate { get; }
    }
}