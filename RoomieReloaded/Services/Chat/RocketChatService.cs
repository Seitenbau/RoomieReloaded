using Microsoft.Extensions.Options;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Chat;
using RoomieReloaded.Models.Users;

namespace RoomieReloaded.Services.Chat;

public class RocketChatService : IChatService
{
    [NotNull] private readonly IOptions<RocketChatConfiguration> _rocketChatConfiguration;
    [NotNull] private readonly IChatMessageService _chatMessageService;

    public RocketChatService(
        [NotNull] IOptions<RocketChatConfiguration> rocketChatConfiguration,
        [NotNull] IChatMessageService chatMessageService)
    {
        this._rocketChatConfiguration = rocketChatConfiguration;
        this._chatMessageService = chatMessageService;
    }

    public async Task<IChatInfo> GetChatInfoAsync(IUser user, ICalendarEventOccurence occurence)
    {
        if (string.IsNullOrEmpty(user.UserName))
        {
            return null;
        }

        var link =
            $"https://go.rocket.chat/room?host={_rocketChatConfiguration.Value.Host}&rid={user.UserName}&path=direct/{user.UserName}";

        var message = await _chatMessageService.GetChatMessageAsync(user, occurence);
        var hint = await _chatMessageService.GetChatHintAsync(user);

        return new ChatInfo(link, message, hint);
    }
}