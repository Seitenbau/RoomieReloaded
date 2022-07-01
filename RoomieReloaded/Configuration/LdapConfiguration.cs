using System;

namespace RoomieReloaded.Configuration;

public class LdapConfiguration
{
    private TimeSpan _timeout;

    public string Host { get; set; }

    public ushort Port { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public int TimeoutInMilliseconds
    {
        get => _timeout.Milliseconds;
        set => _timeout = TimeSpan.FromMilliseconds(value);
    }

    public int TimeoutInSeconds => (int) _timeout.TotalSeconds;

    public string SearchBase { get; set; }

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