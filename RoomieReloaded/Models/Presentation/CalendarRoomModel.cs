using System;
using System.Collections.Generic;
using System.Linq;
using JetBrains.Annotations;
using RoomieReloaded.Models.Calendar;

namespace RoomieReloaded.Models.Presentation
{
    public class CalendarRoomModel
    {
        public CalendarRoomModel(string groupId, string room, IEnumerable<CalendarEventModel> events)
        {
            Room = room;
            GroupId = groupId;
            Events = events.ToList();
        }

        public string GroupId { get; }

        public string Room { get; }

        public List<CalendarEventModel> Events { get; }
    }

    public class CalendarEventModel
    {
        private CalendarEventModel()
        {
        }

        public string Id { get; private set; }

        public string Name { get; private set; }

        public string Organizer { get; private set; }

        public DateTime Start { get; private set; }

        public DateTime End { get; private set; }

        public string ChatWithOrganizerLink { get; private set; }

        public string ChatMessage { get; private set; }

        public string ChatHint { get; private set; }

        public bool IsPrivate { get; private set; }

        public static CalendarEventModel FromCalendarEvent([NotNull] ICalendarEvent ev)
        {
            if (ev == null)
            {
                throw new ArgumentNullException(nameof(ev));
            }

            return new CalendarEventModel
            {
                Id = ev.Id,
                Organizer = ev.Organizer,
                Name = ev.Name,
                Start = ev.From,
                End = ev.To,
                ChatWithOrganizerLink = ev.ChatInfo?.ChatWithOrganizerLink,
                ChatMessage = ev.ChatInfo?.ChatMessage,
                ChatHint = ev.ChatInfo?.ChatHint,
                IsPrivate = ev.IsPrivate
            };
        }
    }
}