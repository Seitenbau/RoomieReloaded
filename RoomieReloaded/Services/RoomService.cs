﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using RoomieReloaded.Configuration;

namespace RoomieReloaded.Services
{
    public class RoomService : IRoomService
    {
        private readonly IOptionsMonitor<RoomConfiguration> _rooms;

        public RoomService(IOptionsMonitor<RoomConfiguration> rooms)
        {
            _rooms = rooms;
        }

        public Task<IEnumerable<IRoom>> GetAllRoomsAsync()
        {
            return Task.FromResult<IEnumerable<IRoom>>(_rooms.CurrentValue);
        }

        public Task<IRoom> GetRoomByNameAsync(string roomName)
        {
            var room = _rooms.CurrentValue.FirstOrDefault(r => string.Equals(r?.Name, roomName));
            return Task.FromResult<IRoom>(room);
        }
    }
}