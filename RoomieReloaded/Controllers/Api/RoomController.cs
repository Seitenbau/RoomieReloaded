using Microsoft.AspNetCore.Mvc;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Controllers.Api;

[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet()]
    [ProducesResponseType(typeof(RoomsModel), StatusCodes.Status200OK)]
    public async Task<IActionResult> Index()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        return this.Ok(new RoomsModel(rooms));
    }

    public class RoomsModel
    {
        public RoomsModel(IEnumerable<IRoom> rooms)
        {
            Rooms = rooms?.ToList() ?? new List<IRoom>();
        }

        public List<IRoom> Rooms { get; }
    }
}