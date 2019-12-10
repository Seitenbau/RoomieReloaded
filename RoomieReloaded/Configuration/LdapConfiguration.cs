namespace RoomieReloaded.Configuration
{
    public class LdapConfiguration
    {
        public string Domain { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string Host { get; set; }

        public int Port { get; set; }

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

            if (string.IsNullOrEmpty(Host))
            {
                return false;
            }

            if (Port <= 0)
            {
                return false;
            }

            return !string.IsNullOrEmpty(Password);
        }
    }
}