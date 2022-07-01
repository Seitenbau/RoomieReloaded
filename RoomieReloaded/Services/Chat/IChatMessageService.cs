using System.Threading.Tasks;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Chat;

public interface IChatMessageService
{
    Task<string> GetChatMessageAsync(IUser user, ICalendarEventOccurence occurence);

    Task<string> GetChatHintAsync(IUser user);
}