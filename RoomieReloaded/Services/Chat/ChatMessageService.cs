using System.Threading.Tasks;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Users;
using RoomieReloaded.Services.Accessors;

namespace RoomieReloaded.Services.Chat
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IRoomAccessor _roomAccessor;

        public ChatMessageService(IRoomAccessor roomAccessor)
        {
            _roomAccessor = roomAccessor;
        }

        public async Task<string> GetChatMessageAsync(IUser user, ICalendarEventOccurence occurence)
        {
            var room = await _roomAccessor.GetCurrentRoomAsync();

            // TODO DEV-3 make this localizable with https://tracker.seitenbau.net/browse/DEV-3
            const string messageTemplate = "Hi {0}, es geht um den Termin am {1} um {2} im Raum \"{3}\".";
            var message = string.Format(messageTemplate,
                user.FirstName,
                occurence.From.ToShortDateString(),
                occurence.From.ToShortTimeString(),
                room.NiceName);

            return message;
        }

        public Task<string> GetChatHintAsync(IUser user)
        {
            // TODO DEV-3 make this localizable with https://tracker.seitenbau.net/browse/DEV-3
            const string hintTemplate = "Doppelklicken, um mit {0} zu chatten.";
            return Task.FromResult(string.Format(hintTemplate, user.FirstName));
        }
    }
}