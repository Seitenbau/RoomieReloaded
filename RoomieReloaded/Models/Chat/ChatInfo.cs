namespace RoomieReloaded.Models.Chat
{
    public class ChatInfo : IChatInfo
    {
        public ChatInfo(string link, string message)
        {
            ChatWithOrganizerLink = link;
            ChatMessage = message;
        }

        public string ChatWithOrganizerLink { get; }

        public string ChatMessage { get; }
    }
}