import { CalendarType } from '../../utility/dateTimeHelper';
import { NavigationService, DayNavigationService, WeekNavigationService, MonthNavigationService } from './navigationService';

export function createNavigationService(calendar:CalendarType):NavigationService {
    switch(calendar){
        case "DAY": return new DayNavigationService();
        case "WEEK": 
        case "WORKWEEK":
            return new WeekNavigationService();
        case "MONTH": return new MonthNavigationService();
    }
}