using System.Threading.Tasks;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Logging;
using RoomieReloaded.Models.Calendar;
using RoomieReloaded.Models.Users;
using RoomieReloaded.Services.Chat;
using RoomieReloaded.Services.Rooms;
using RoomieReloaded.Services.Users;

namespace RoomieReloaded.Services.CalendarEvents;

public class CalendarEventFactory : ICalendarEventFactory
{
    private readonly IChatService _chatService;
    private readonly ILogger<CalendarEventFactory> _logger;
    private readonly ICachingUserLookupService _userLookupService;

    public CalendarEventFactory(ILogger<CalendarEventFactory> logger, ICachingUserLookupService userLookupService,
        IChatService chatService)
    {
        _logger = logger;
        _userLookupService = userLookupService;
        _chatService = chatService;
    }

    public async Task<ICalendarEvent> CreateFromOccurenceAsync(Occurrence occurrence, IRoom room)
    {
        LogOccurence(occurrence);
        var calendarEvent = (CalendarEvent) occurrence.Source;
        var isPrivateEvent = IsPrivateEvent(calendarEvent);
        var eventId = $"{calendarEvent.Uid}-{occurrence.Period}";
        var subject = room.ShowSubject ? calendarEvent.Summary : string.Empty;

        var user = isPrivateEvent
            ? new PrivateEventUser()
            : await GetUser(calendarEvent);
            
        var eventOccurence = new IcalCalendarEventOccurence(occurrence, isPrivateEvent, room.ShowSubject);
        var chatInfo = await _chatService.GetChatInfoAsync(user, eventOccurence);

        return new RoomieCalendarEvent(user, eventOccurence, chatInfo);
    }

    private async Task<IUser> GetUser(CalendarEvent calendarEvent)
    {
        var user = await _userLookupService.GetUserAsync(calendarEvent.Organizer);
        return user;
    }

    public bool IsPrivateEvent(CalendarEvent calendarEvent)
    {
        return calendarEvent.Class == Constants.IcsConstants.PrivateEventClass;
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

    private class PrivateEventUser : IUser
    {
        public string DisplayName { get; } = "Privat";
        public string FirstName { get; } = string.Empty;
        public string UserName { get; } = string.Empty;
        public string MailAddress { get; } = string.Empty;
    }
}