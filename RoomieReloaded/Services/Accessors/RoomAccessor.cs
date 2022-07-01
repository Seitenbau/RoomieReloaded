using System;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Services.Accessors;

public class RoomAccessor : IRoomAccessor
{
    private IHttpContextAccessor _httpContextAccessor;
    private IRoomService _roomService;

    public RoomAccessor(IHttpContextAccessor httpContextAccessor, IRoomService roomService)
    {
        _httpContextAccessor = httpContextAccessor;
        _roomService = roomService;
    }

    public async Task<IRoom> GetCurrentRoomAsync()
    {
        var roomName = GetRoomName();
        var room = await GetRoom(roomName);
        return room;
    }

    [NotNull]
    [ItemNotNull]
    private async Task<IRoom> GetRoom(string roomName)
    {
        var room = await _roomService.GetRoomByNameAsync(roomName);

        if (room == null)
        {
            throw new InvalidOperationException($"The room '{roomName}' does not exist.");
        }

        return room;
    }

    [NotNull]
    private string GetRoomName()
    {
        var roomName =
            _httpContextAccessor.HttpContext.GetRouteValue(Constants.RouteConstants.RoomPathIdentifier) as string;

        if (string.IsNullOrEmpty(roomName))
        {
            throw new InvalidOperationException(
                $"Accessing the requests room is only possible for requests with parameter '{Constants.RouteConstants.RoomPathIdentifier}'.");
        }

        return roomName;
    }
}