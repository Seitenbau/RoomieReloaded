using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Chat;
using RoomieReloaded.Models.Users;
using RoomieReloaded.Services.Accessors;

namespace RoomieReloaded.Services.Chat
{
    public class RocketChatService : IChatService
    {
        private readonly IOptions<RocketChatConfiguration> _rocketChatConfiguration;
        private readonly IRoomAccessor _roomAccessor;

        public RocketChatService(IOptions<RocketChatConfiguration> rocketChatConfiguration, IRoomAccessor roomAccessor)
        {
            this._rocketChatConfiguration = rocketChatConfiguration;
            _roomAccessor = roomAccessor;
        }

        public async Task<IChatInfo> GetChatInfoAsync(IUser user, ICalendarEventOccurence occurence)
        {
            if (string.IsNullOrEmpty(user.UserName))
            {
                return null;
            }

            var link =
                $"https://go.rocket.chat/room?host={_rocketChatConfiguration.Value.Host}&rid={user.UserName}&path=direct/{user.UserName}";

            var room = await _roomAccessor.GetCurrentRoomAsync();

            // TODO DEV-3 make this localizable with https://tracker.seitenbau.net/browse/DEV-3
            const string messageTemplate = "Hi {0}, es geht um den Termin am {1} um {2} in Raum {3}";
            var message = string.Format(messageTemplate,
                user.FirstName,
                occurence.From.ToShortDateString(),
                occurence.From.ToShortTimeString(),
                room.NiceName);

            return new ChatInfo(link, message);
        }
    }
}