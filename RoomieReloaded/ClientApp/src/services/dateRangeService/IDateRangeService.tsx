import * as moment from 'moment';
import { IHasDateRange } from '../../components/planner/base/plannerTypes';

export interface IDateRangeService{
    calculateDateRange(dateTime:moment.Moment):IHasDateRange;
}

abstract class DateRangeService implements IDateRangeService {

    calculateDateRange = (dateTime:moment.Moment):IHasDateRange =>
    {
        const unitOfTime = this.getUnitOfTime();

        const start = dateTime.clone().startOf(unitOfTime);
        const end = dateTime.clone().endOf(unitOfTime);

        return {
            start:start,
            end:end
        }
    }

    abstract getUnitOfTime():moment.unitOfTime.StartOf;
}

export class DayRangeService extends DateRangeService{
    getUnitOfTime = ():moment.unitOfTime.StartOf => 
    {
        return 'day';
    }
}

export class WeekRangeService extends DateRangeService{
    getUnitOfTime = ():moment.unitOfTime.StartOf => 
    {
        return 'isoWeek';
    }
}

export class MonthRangeService extends DateRangeService{
    getUnitOfTime = ():moment.unitOfTime.StartOf => 
    {
        return 'month';
    }
}