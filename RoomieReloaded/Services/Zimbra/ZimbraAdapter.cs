using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;

namespace RoomieReloaded.Services.Zimbra
{
    public class ZimbraAdapter : IZimbraAdapter
    {
        private const string Dateformat = "yyyy/MM/dd";

        private readonly IOptions<ZimbraAdapterConfiguration> _configuration;

        public ZimbraAdapter(IOptions<ZimbraAdapterConfiguration> configuration)
        {
            this._configuration = configuration;
        }

        public async Task<string> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end)
        {
            var startString = GetDateString(start);
            var endString = GetDateString(end);

            var baseUrl = _configuration.Value.GetBaseUri();

            var url = $"{baseUrl}/{room}?fmt=ics&start={startString}&end={endString}&auth=ba";
            var request = WebRequest.CreateHttp(url);

            request.Headers["Authorization"] = CreateBasicAuthHeader();

            // TODO exception handling

            using (var response = (HttpWebResponse) request.GetResponse())
            {
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    using (var stream = response.GetResponseStream())
                    using (var reader = new StreamReader(stream))
                    {
                        return await reader.ReadToEndAsync();
                    }
                }
            }

            return string.Empty;
        }

        private static string GetDateString(DateTime start)
        {
            return start.ToString(Dateformat, CultureInfo.InvariantCulture);
        }

        private string CreateBasicAuthHeader()
        {
            return _configuration.Value.GetBasicAuthHeaderValue();
        }
    }
}