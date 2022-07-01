using RoomieReloaded.Models.Chat;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Models.Calendar;

public class RoomieCalendarEvent : ICalendarEvent
{
    [NotNull] private readonly IUser _organizer;

    [NotNull] private readonly ICalendarEventOccurence _occurence;

    public RoomieCalendarEvent([NotNull] IUser organizer,
        [NotNull] ICalendarEventOccurence occurence,
        [CanBeNull] IChatInfo chatInfo)
    {
        this._organizer = organizer;
        this._occurence = occurence;
        this.ChatInfo = chatInfo;
    }

    public bool IsPrivate => _occurence.IsPrivateEvent;

    public string Id => _occurence.EventId;

    public string Name => _occurence.ShowSubject ? _occurence.Subject : null;

    public string Organizer => _organizer.DisplayName;

    public DateTime From => _occurence.From;

    public DateTime To => _occurence.To;

    public IChatInfo ChatInfo { get; }
}