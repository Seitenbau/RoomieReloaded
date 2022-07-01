namespace RoomieReloaded.Models.Chat;

public class ChatInfo : IChatInfo
{
    public ChatInfo(string link, string message, string chatHint)
    {
        ChatWithOrganizerLink = link;
        ChatMessage = message;
        ChatHint = chatHint;
    }

    public string ChatWithOrganizerLink { get; }

    public string ChatMessage { get; }

    public string ChatHint { get; }
}