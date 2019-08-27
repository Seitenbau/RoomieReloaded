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
            if(obj != null && obj.Id != null) {
                return obj.Id.GetHashCode();
            }
            
            return obj.GetHashCode();
        }
    }
}
