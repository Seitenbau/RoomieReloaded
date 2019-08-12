import moment from 'moment';
import { getCurrentDateTime } from '../../selectors/calendarSelectors';
import { RootState } from '../../reducers';

export abstract class NavigationService {
    navigateToday = ():moment.Moment =>
    {
        return moment();
    }

    abstract getNavigationInterval():any;

    navigateNext = (state:RootState):moment.Moment =>
    {
        const interval = this.getNavigationInterval();
        const currentDateTime = getCurrentDateTime(state);
        return currentDateTime.add(1, interval);
    }
    navigatePrevious = (state:RootState):moment.Moment =>
    {
        const interval = this.getNavigationInterval();
        const currentDateTime = getCurrentDateTime(state);
        return currentDateTime.subtract(1, interval);
    }
}

export class DayNavigationService extends NavigationService {
    getNavigationInterval = ():any =>
    {
        return 'days';
    }
}

export class WeekNavigationService extends NavigationService {
    getNavigationInterval = ():any =>
    {
        return 'weeks';
    }
}

export class MonthNavigationService extends NavigationService {
    getNavigationInterval = ():any =>
    {
        return 'months';
    }
}