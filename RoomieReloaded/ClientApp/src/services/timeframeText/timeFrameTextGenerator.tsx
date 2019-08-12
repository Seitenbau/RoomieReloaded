import { Moment } from 'moment';
import { getDayOfWeek, Days } from '../../utility/dateTimeHelper';

export interface ITimeFrameTextGenerator
{
    getTimeFrameText(dateTime:Moment) : string;
}

export class DayTimeFrameTextGenerator implements ITimeFrameTextGenerator 
{
    getTimeFrameText = (dateTime:Moment) : string =>
    {
        return dateTime.format('dddd, LL');
    }
}

export class WeekTimeFrameTextGenerator implements ITimeFrameTextGenerator 
{
    getTimeFrameText = (dateTime:Moment) : string =>
    {
        const startOfWeek = getDayOfWeek(Days.MONDAY, dateTime);
        const endOfWeek = getDayOfWeek(Days.FRIDAY, dateTime);
        
        const monthYearAndWeek = dateTime.format('MMMM YYYY, [KW]WW');
        const beginDate = startOfWeek.format('DD.MM.');
        const endDate = endOfWeek.format('DD.MM.');

        return `${monthYearAndWeek} (${beginDate} - ${endDate})`;
    }
}

export class MonthTimeFrameTextGenerator implements ITimeFrameTextGenerator 
{
    getTimeFrameText = (dateTime:Moment) : string =>
    {        
        return dateTime.format('MMMM YYYY');
    }
}