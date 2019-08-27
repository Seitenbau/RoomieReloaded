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

			var eventOccurences = calendar.Events
				.Where(ev => ev != null)
				.Where(ev => ev.Status.Equals("CONFIRMED"))
				// Show only events where the room accepted the invite
				.Where(ev => ev.Attendees != null)
				.Where(ev => ev.Attendees.Any(att => att.Value.UserInfo.Equals(roomEmail) && att.ParticipationStatus.Equals("ACCEPTED")))				
				// Show Only events that overlap with from and to
				.Where(ev => ev.DtStart.AsUtc < to && from < ev.DtEnd.AsUtc)				
				.ToDictionary(ev => ev, ev => ev.GetOccurrences(from, to));

			var events = CreateCalendarEvents(eventOccurences);

			return events;
		}

		private IEnumerable<ICalendarEvent> CreateCalendarEvents(
			IDictionary<CalendarEvent, HashSet<Occurrence>> eventOccurences)
		{
			foreach (var calendarEvent in eventOccurences.Keys)
			{
				var occurences = eventOccurences[calendarEvent];
				foreach (var occurence in occurences)
                {
                    Log(calendarEvent, occurence);
					yield return new RoomieCalendarEvent(calendarEvent, occurence);
				}
			}
		}

        private void Log(CalendarEvent calendarEvent, Occurrence occurence)
        {
            _logger.LogInformation($"Converting event. organizer: {calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.AbsolutePath ?? string.Empty}");
            _logger.LogInformation($"start. utc: {occurence.Period.StartTime.AsUtc}, local: {occurence.Period.StartTime.AsSystemLocal}, timezone: {occurence.Period.StartTime.TimeZoneName}");
            _logger.LogInformation($"end. utc: {occurence.Period.EndTime.AsUtc}, local: {occurence.Period.EndTime.AsSystemLocal}, timezone: {occurence.Period.EndTime.TimeZoneName}");
        }
    }

	public class RoomieCalendarEvent : ICalendarEvent
	{
		public RoomieCalendarEvent(CalendarEvent calendarEvent, Occurrence occurence)
		{
            Id = $"{calendarEvent.Uid}-{occurence.Period}";
            Organizer = calendarEvent.Organizer?.CommonName ?? calendarEvent.Organizer?.Value?.AbsolutePath ?? string.Empty;
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
