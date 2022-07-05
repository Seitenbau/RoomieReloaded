using System.Text;

namespace RoomieReloaded.Configuration;

public class ZimbraAdapterConfiguration
{
    public string Host { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public Uri GetBaseUri()
    {
        var uri = $"{Host}/home/{UserName}";
        return new Uri(uri);
    }

    public string GetBasicAuthHeaderValue()
    {
        var value = $"{UserName}:{Password}";
        var array = Encoding.UTF8.GetBytes(value);
        value = Convert.ToBase64String(array);
        return $"Basic {value}";
    }
}