using System;
using JetBrains.Annotations;
using RoomieReloaded.Models.Chat;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Models.Calendar
{
    public class RoomieCalendarEvent : ICalendarEvent
    {
        [NotNull] private readonly IUser _organizer;

        [NotNull] private readonly ICalendarEventOccurence _occurence;

        [CanBeNull] private readonly IChatInfo _chatInfo;

        public RoomieCalendarEvent([NotNull] IUser organizer,
            [NotNull] ICalendarEventOccurence occurence,
            [CanBeNull] IChatInfo chatInfo)
        {
            this._organizer = organizer;
            this._occurence = occurence;
            this._chatInfo = chatInfo;
        }

        public string Id { get; }

        public string Name => string.Empty; // currently not shown due to data security reasons

        public string Organizer => _organizer.DisplayName;

        public DateTime From => _occurence.From;

        public DateTime To => _occurence.To;

        public string ChatWithOrganizerLink => _chatInfo?.ChatWithOrganizerLink;

        public string ChatMessageTemplate => _chatInfo?.ChatMessage;
    }
}