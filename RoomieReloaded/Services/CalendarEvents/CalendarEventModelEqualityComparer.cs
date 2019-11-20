using System.Collections.Generic;
using RoomieReloaded.Models;
using RoomieReloaded.Models.Presentation;

namespace RoomieReloaded.Services.CalendarEvents
{
    public class CalendarEventModelEqualityComparer : IEqualityComparer<CalendarEventModel>
    {
        public bool Equals(CalendarEventModel x, CalendarEventModel y)
        {
            if(x == null)
            {
                return y == null;
            }

            if(y == null)
            {
                return false;
            }

            return x.Id == y.Id;
        }

        public int GetHashCode(CalendarEventModel obj)
        {
            return obj.Id != null ? obj.Id.GetHashCode() : obj.GetHashCode();
        }
    }
}
