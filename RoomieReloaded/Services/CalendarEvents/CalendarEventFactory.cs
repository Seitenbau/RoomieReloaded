using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Logging;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Services.Chat;
using RoomieReloaded.Services.Users;

namespace RoomieReloaded.Services.CalendarEvents
{
    public class CalendarEventFactory : ICalendarEventFactory
    {
        private readonly ILogger<CalendarEventFactory> _logger;
        private readonly ICachingUserLookupService _userLookupService;
        private readonly IChatService _chatService;

        public CalendarEventFactory(ILogger<CalendarEventFactory> logger, ICachingUserLookupService userLookupService, IChatService chatService)
        {
            _logger = logger;
            _userLookupService = userLookupService;
            _chatService = chatService;
        }

        public async Task<ICalendarEvent> CreateFromOccurenceAsync(Occurrence occurrence)
        {
            LogOccurence(occurrence);
            var calendarEvent = (CalendarEvent) occurrence.Source;

            var user = await _userLookupService.GetUserAsync(calendarEvent.Organizer);
            var eventOccurence = new IcalCalendarEventOccurence(occurrence);
            var chatInfo = await _chatService.GetChatInfoAsync(user, eventOccurence);

            return new RoomieCalendarEvent(user, eventOccurence, chatInfo);
        }

        private void LogOccurence(Occurrence occurence)
        {
            var calendarEvent = (CalendarEvent) occurence.Source;
            LogOccurence(calendarEvent, occurence);
        }

        private void LogOccurence(CalendarEvent calendarEvent, Occurrence occurence)
        {
            _logger.LogInformation(
                $"### Converting event. id: {calendarEvent.RecurrenceId} organizer: {calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.AbsolutePath ?? string.Empty}");
            _logger.LogInformation($"### name: {calendarEvent.Summary} status: {calendarEvent.Status}");
            _logger.LogInformation(
                $"### period start. utc: {occurence.Period.StartTime.AsUtc}, local: {occurence.Period.StartTime.AsSystemLocal}, timezone: {occurence.Period.StartTime.TimeZoneName}");
            _logger.LogInformation(
                $"### period end. utc: {occurence.Period.EndTime.AsUtc}, local: {occurence.Period.EndTime.AsSystemLocal}, timezone: {occurence.Period.EndTime.TimeZoneName}");
        }
    }
}