using System.Collections.Generic;
using RoomieReloaded.Services;

namespace RoomieReloaded.Configuration
{
	public class Room : IRoom
	{
		public string Name { get; set; }

		public string Mail { get; set; }

		public string NiceName { get; set; }
	}

    public class RoomConfiguration : List<Room>
    {
    }
}