using System.DirectoryServices.Protocols;
using System.Net;

namespace RoomieReloaded.Configuration
{
    public class LdapConfiguration
    {
        public string Domain { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public int TimeoutInMilliseconds { get; set; } = 3000;

        public string SearchBase { get; set; }

        public NetworkCredential CreateCredentials()
        {
            return new NetworkCredential(
                UserName,
                Password,
                Domain);
        }

        public LdapDirectoryIdentifier CreateIdentifier()
        {
            return new LdapDirectoryIdentifier(Domain);
        }

        public bool Validate()
        {
            if (string.IsNullOrEmpty(Domain))
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
}