using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RoomieReloaded.Models;
using RoomieReloaded.Models.Presentation;
using RoomieReloaded.Services;
using RoomieReloaded.Services.Calendar;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private const string DateStartParameterName = "start";
        private const string DateEndParameterName = "end";
        private const string RoomRouteTemplate = "{" + Constants.RouteConstants.RoomPathIdentifier + "}";

        private readonly IRoomService _roomService;
        private readonly ICalendarService _calendarService;
        private readonly IEqualityComparer<CalendarEventModel> _calendarEventModelComparer;

        public CalendarController(IRoomService roomService, ICalendarService calendarService,
            IEqualityComparer<CalendarEventModel> calendarEventModelComparer)
        {
            _roomService = roomService;
            _calendarService = calendarService;
            _calendarEventModelComparer = calendarEventModelComparer;
        }

        [HttpGet(RoomRouteTemplate)]
        public async Task<IActionResult> Index(
            [FromRoute(Name = Constants.RouteConstants.RoomPathIdentifier)]
            string roomName,
            [FromQuery(Name = DateStartParameterName)]
            string dateStart,
            [FromQuery(Name = DateEndParameterName)]
            string dateEnd)
        {
            var room = await _roomService.GetRoomByNameAsync(roomName);

            if (room == null)
            {
                return BadRequest($"Room '{roomName}' does not exist");
            }

            try
            {
                var dates = ParseDates(dateStart, dateEnd);

                var model = await CreateCalendarRoomModel(room, dates.From, dates.To);

                return Ok(model);
            }
            catch (BadRequestException e)
            {
                return BadRequest(e.Message);
            }
        }

        private async Task<CalendarRoomModel> CreateCalendarRoomModel(IRoom room, DateTime from, DateTime to)
        {
            var calendarEvents =
                await _calendarService.GetCalendarEventsAsync(room.Name, from.Date, to.Date.AddDays(1));

            var calendarEventModels = calendarEvents.Select(CalendarEventModel.FromCalendarEvent)
                .Distinct(_calendarEventModelComparer);

            var model = new CalendarRoomModel(room.Name, room.NiceName, calendarEventModels);
            return model;
        }

        private ParseDatesModel ParseDates(string dateStart, string dateEnd)
        {
            var from = SafeParseDate(dateStart, DateStartParameterName);
            var to = SafeParseDate(dateEnd, DateEndParameterName);

            return new ParseDatesModel(from, to);
        }

        private DateTime SafeParseDate(string dateString, string parameterName)
        {
            try
            {
                return ParseDateTime(dateString);
            }
            catch (Exception)
            {
                throw new BadRequestException($"'{parameterName}' is no valid DateTime string");
            }
        }

        private DateTime ParseDateTime(string dateString)
        {
            return DateTime.Parse(dateString, CultureInfo.InvariantCulture,
                DateTimeStyles.AdjustToUniversal | DateTimeStyles.AssumeUniversal);
        }

        private class ParseDatesModel
        {
            public ParseDatesModel(DateTime from, DateTime to)
            {
                From = from;
                To = to;
            }

            public DateTime From { get; }

            public DateTime To { get; }
        }
    }
}