// ReSharper disable UnusedAutoPropertyAccessor.Global
// ReSharper disable UnusedMember.Global
// Initializers used for configuration deserialization
namespace RoomieReloaded.Configuration;

/// <summary>
///     LDAP configuration for username lookups.
///     Enables direct chat links to event organizers.
/// </summary>
public class LdapConfiguration
{
    private TimeSpan _timeout;
    
    /// <summary>
    ///     Enable or disable username lookup.
    /// </summary>
    public bool UseLdap { get; init; }

    public string Host { get; init; }

    public ushort Port { get; init; }

    public string UserName { get; init; }

    public string Password { get; init; }

    public int TimeoutInMilliseconds
    {
        get => _timeout.Milliseconds;
        init => _timeout = TimeSpan.FromMilliseconds(value);
    }

    public int TimeoutInSeconds => (int) _timeout.TotalSeconds;

    public string SearchBase { get; init; }

    public bool Validate()
    {
        if (string.IsNullOrEmpty(Host))
        {
            return false;
        }

        if (Port == 0)
        {
            return false;
        }

        if (string.IsNullOrEmpty(UserName))
        {
            return false;
        }

        return !string.IsNullOrEmpty(Password);
    }
}