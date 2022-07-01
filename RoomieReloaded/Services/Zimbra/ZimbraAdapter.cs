using System.Globalization;
using System.Net;
using JetBrains.Annotations;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;

namespace RoomieReloaded.Services.Zimbra;

public class ZimbraAdapter : IZimbraAdapter
{
    private const string Dateformat = "yyyy/MM/dd";

    [NotNull] private readonly HttpClient _httpClient;

    [NotNull] private readonly IOptions<ZimbraAdapterConfiguration> _configuration;

    [NotNull] private readonly ILogger<ZimbraAdapter> _logger;

    public ZimbraAdapter(
        [NotNull] HttpClient httpClient,
        [NotNull] IOptions<ZimbraAdapterConfiguration> configuration,
        [NotNull] ILogger<ZimbraAdapter> logger)
    {
        this._httpClient = httpClient;
        this._configuration = configuration;
        this._logger = logger;
    }

    public async Task<string> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end)
    {
        var startString = GetDateString(start);
        var endString = GetDateString(end);

        var baseUrl = _configuration.Value?.GetBaseUri();
        var url = $"{baseUrl}/{room}?fmt=ics&start={startString}&end={endString}&auth=ba";

        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("Authorization", CreateBasicAuthHeader());
        var response = await this._httpClient.SendAsync(request);

        try
        {
            if (response.StatusCode == HttpStatusCode.OK)
            {
                using var reader = new StreamReader(await response.Content.ReadAsStreamAsync());
                return await reader.ReadToEndAsync();
            }

            this._logger.LogError(
                "Invalid status code {StatusCode} when requesting data for resource '{Room}' from Zimbra, resource is ignored",
                response.StatusCode,
                room);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error when requesting data for resource '{Room}' from Zimbra, resource is ignored",
                room);
        }

        return string.Empty;
    }

    private static string GetDateString(DateTime start)
    {
        return start.ToString(Dateformat, CultureInfo.InvariantCulture);
    }

    private string CreateBasicAuthHeader()
    {
        return _configuration.Value?.GetBasicAuthHeaderValue();
    }
}