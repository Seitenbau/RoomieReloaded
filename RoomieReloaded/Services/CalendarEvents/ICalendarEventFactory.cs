using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Logging;
using RoomieReloaded.Models;

namespace RoomieReloaded.Services.CalendarEvents
{
    public interface ICalendarEventFactory
    {
        ICalendarEvent CreateFromOccurence(Occurrence occurrence);
    }

    public class CalendarEventFactory : ICalendarEventFactory
    {
        private readonly ILogger<CalendarEventFactory> _logger;

        public CalendarEventFactory(ILogger<CalendarEventFactory> logger)
        {
            _logger = logger;
        }

        public ICalendarEvent CreateFromOccurence(Occurrence occurrence)
        {
            LogOccurence(occurrence);
            return new RoomieCalendarEvent(occurrence);
        }

        private void LogOccurence(Occurrence occurence)
        {
            CalendarEvent calendarEvent = (CalendarEvent) occurence.Source;
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