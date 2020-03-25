using System;
using JetBrains.Annotations;
using RoomieReloaded.Models.Chat;

namespace RoomieReloaded.Models.Calendar
{
    public interface ICalendarEvent
    {
        bool IsPrivate { get; }

        string Id { get; }
        
        string Name { get; }

        string Organizer { get; }

        DateTime From { get; }

        DateTime To { get; }

        [CanBeNull]
        IChatInfo ChatInfo { get; }
    }
}