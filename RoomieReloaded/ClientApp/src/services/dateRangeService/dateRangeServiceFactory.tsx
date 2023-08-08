import { IDateRangeService, DayRangeService, WeekRangeService, MonthRangeService } from './dateRangeService';
import { CalendarType } from '../../reducers/calendarReducer';

export interface IDateRangeServiceFactory{
    create(calendarType:CalendarType):IDateRangeService;
}

export class DateRangeServiceFactory implements IDateRangeServiceFactory{
    create = (calendarType:CalendarType):IDateRangeService => 
    {
        switch(calendarType){
            case 'DAY':
                return new DayRangeService();
            case 'WORKWEEK':
            case 'WEEK':
                return new WeekRangeService();
            case 'MONTH':
                return new MonthRangeService();
        }
    }
}