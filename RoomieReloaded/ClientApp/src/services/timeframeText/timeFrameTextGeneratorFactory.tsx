import { CalendarType } from '../../utility/dateTimeHelper';
import { 
    ITimeFrameTextGenerator, 
    DayTimeFrameTextGenerator, 
    WeekTimeFrameTextGenerator, 
    MonthTimeFrameTextGenerator 
} from './timeFrameTextGenerator';

export function createTimeFrameTextGenerator(board:CalendarType) : ITimeFrameTextGenerator {
    switch(board)
    {
        case 'DAY':
            return new DayTimeFrameTextGenerator();
        case 'WEEK':
        case 'WORKWEEK':
            return new WeekTimeFrameTextGenerator();
        case 'MONTH':
            return new MonthTimeFrameTextGenerator();
    }
}