namespace RoomieReloaded.Models.Chat;

public interface IChatInfo
{
    [NotNull] string ChatWithOrganizerLink { get; }

    [NotNull] string ChatMessage { get; }

    [NotNull] string ChatHint { get; }
}