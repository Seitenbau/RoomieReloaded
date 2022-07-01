using System.Collections.Generic;
using RoomieReloaded.Services.Rooms;

namespace RoomieReloaded.Configuration;

public class Room : IRoom
{
	public string Name { get; set; }

	public string Mail { get; set; }

	public string NiceName { get; set; }

	public bool ShowSubject { get; set; }

	public string Category { get; set; }

	public string Link { get; set; }
}

public class RoomConfiguration : List<Room>
{
}