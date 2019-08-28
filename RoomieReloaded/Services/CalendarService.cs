using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Microsoft.Extensions.Logging;

namespace RoomieReloaded.Services
{
	public class CalendarService : ICalendarService
	{
        private readonly ILogger<CalendarService> _logger;
        private readonly IZimbraAdapter _zimbraAdapter;

		public CalendarService(ILogger<CalendarService> logger, IZimbraAdapter zimbraAdapter)
        {
            _logger = logger;
            _zimbraAdapter = zimbraAdapter;
        }

		public async Task<IEnumerable<ICalendarEvent>> GetCalendarEventsAsync(string roomEmail, DateTime from, DateTime to)
		{
			var icsCalendar = await _zimbraAdapter.GetRoomCalendarAsIcsStringAsync(roomEmail, from, to);

			var calendar = Calendar.Load(icsCalendar);

			var eventOccurences = calendar.GetOccurrences(from, to);
	
			var events = CreateCalendarEvents(eventOccurences, roomEmail);

			return events;
		}

		private IEnumerable<ICalendarEvent> CreateCalendarEvents(
			HashSet<Occurrence> eventOccurences, String roomEmail)
		{
				foreach (var occurence in eventOccurences)
                {
					CalendarEvent calendarEvent = (CalendarEvent) occurence.Source;
					// Show Only events that overlap with from and to
					if(calendarEvent.Attendees.Any(att => att.Value.UserInfo.Equals(roomEmail) && att.ParticipationStatus.Equals("ACCEPTED")))
					{				
						Log(occurence);
						yield return new RoomieCalendarEvent(occurence);
					}
				}
			
		}

        private void Log(CalendarEvent calendarEvent, Occurrence occurence)
        {
            _logger.LogInformation($"### Converting event. id: {calendarEvent.RecurrenceId} organizer: {calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.AbsolutePath ?? string.Empty}");
            _logger.LogInformation($"### name: {calendarEvent.Summary} status: {calendarEvent.Status}");
            _logger.LogInformation($"### period start. utc: {occurence.Period.StartTime.AsUtc}, local: {occurence.Period.StartTime.AsSystemLocal}, timezone: {occurence.Period.StartTime.TimeZoneName}");
            _logger.LogInformation($"### period end. utc: {occurence.Period.EndTime.AsUtc}, local: {occurence.Period.EndTime.AsSystemLocal}, timezone: {occurence.Period.EndTime.TimeZoneName}");
        }


        private void Log(Occurrence occurence)
        {
			CalendarEvent calendarEvent = (CalendarEvent) occurence.Source;
            Log(calendarEvent, occurence);
        }		
    }

	public class RoomieCalendarEvent : ICalendarEvent
	{
		public RoomieCalendarEvent(CalendarEvent calendarEvent, Occurrence occurence)
		{
			Id = $"{calendarEvent.Uid}-{occurence.Period}";
			Organizer = calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.UserInfo ?? string.Empty;

			From = occurence.Period.StartTime.AsUtc;
			To = occurence.Period.EndTime.AsUtc;

			// TODO is Summary allowed to be shown publicly?
			Name = string.Empty; // calendarEvent.Summary;
		}

		public RoomieCalendarEvent(Occurrence occurence)
		{
			CalendarEvent calendarEvent = (CalendarEvent) occurence.Source;
			Id = $"{calendarEvent.Uid}-{occurence.Period}";
			Organizer = calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.UserInfo ?? string.Empty;

			From = occurence.Period.StartTime.AsUtc;
			To = occurence.Period.EndTime.AsUtc;

			// TODO is Summary allowed to be shown publicly?
			Name = string.Empty; // calendarEvent.Summary;
		}		
		public string Id { get; }
		public string Name { get; }
		public string Organizer { get; }
		public DateTime From { get; }
		public DateTime To { get; }
	}
}
