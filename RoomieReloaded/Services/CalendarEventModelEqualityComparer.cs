using RoomieReloaded.Models;
using System.Collections.Generic;

namespace RoomieReloaded.Services
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
            return obj.Id.GetHashCode();
        }
    }
}
