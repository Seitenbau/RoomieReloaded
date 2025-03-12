using System.Globalization;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;

namespace RoomieReloaded.Services.Zimbra;

public class ZimbraAdapter : ControllerBase, IZimbraAdapter
{
    private const string Dateformat = "yyyy/MM/dd";

    [NotNull] private readonly HttpClient _httpClient;

    [NotNull] private readonly IOptions<ZimbraAdapterConfiguration> _configuration;

    [NotNull] private readonly ILogger<ZimbraAdapter> _logger;

    private IHttpContextAccessor _httpContextAccessor;

    public ZimbraAdapter(
        [NotNull] HttpClient httpClient,
        [NotNull] IOptions<ZimbraAdapterConfiguration> configuration,
        [NotNull] ILogger<ZimbraAdapter> logger,
        IHttpContextAccessor httpContextAccessor)
    {
        this._httpClient = httpClient;
        this._configuration = configuration;
        this._logger = logger;
        this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<IActionResult> GetRoomCalendarAsIcsStringAsync(string room, DateTime start, DateTime end)
    {
        var startString = GetDateString(start);
        var endString = GetDateString(end);

        var baseUrl = _configuration.Value?.GetBaseUri();
        var url = $"{baseUrl}/{room}?fmt=ics&start={startString}&end={endString}&auth=ba";

        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("Authorization", CreateBasicAuthHeader());

        CancellationToken cancellationToken = _httpContextAccessor.HttpContext.RequestAborted;

        if (cancellationToken.IsCancellationRequested)
        {
            return Conflict(new {error= true, message="Request wurde vom Nutzer abgebrochen"});
        }

        var response = await this._httpClient.SendAsync(request, cancellationToken);

        try
        {
            if (response.StatusCode == HttpStatusCode.OK)
            {
                using var reader = new StreamReader(await response.Content.ReadAsStreamAsync());
                var result = await reader.ReadToEndAsync();
                return Ok(result);
            }

            this._logger.LogError(
                "Invalid status code {StatusCode} when requesting data for resource '{Room}' from Zimbra, resource is ignored",
                response.StatusCode,
                room);

                return BadRequest("Ungültiger status code von Zimbra: " + response.StatusCode);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error when requesting data for resource '{Room}' from Zimbra, resource is ignored", room);
            return BadRequest("Fehler beim Abruf von Zimbra: " + e.Message);
        }
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