using Ical.Net.DataTypes;

namespace RoomieReloaded.Extensions;

public static class OrganizerExtension
{
    public static string GetEmailAddress(this Organizer organizer)
    {
        return organizer.Value?.UserInfo == null
            ? null
            : $"{organizer.Value.UserInfo}@{organizer.Value.Host}";
    }

    public static bool HasCommonName(this Organizer organizer)
    {
        return !string.IsNullOrEmpty(organizer.CommonName);
    }

    public static bool HasEmailAddress(this Organizer organizer)
    {
        return !string.IsNullOrEmpty(organizer.Value.UserInfo);
    }

    public static string GetDisplayName(this Organizer organizer)
    {
        if (organizer.HasCommonName())
        {
            return organizer.CommonName;
        }

        return organizer.Value.UserInfo;
    }
}