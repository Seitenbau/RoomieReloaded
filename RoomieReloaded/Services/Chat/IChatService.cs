using JetBrains.Annotations;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Chat;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Chat;

public interface IChatService
{
    [NotNull]
    [ItemCanBeNull]
    Task<IChatInfo> GetChatInfoAsync([NotNull] IUser user, [NotNull] ICalendarEventOccurence occurence);
}