import moment from 'moment';

export type CalendarType = 'MONTH' | 'WEEK' | 'WORKWEEK' | 'DAY';

export enum Days {
    MONDAY = 0,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

export function getDay(dayIndexInWeek: number): Days {
    while (dayIndexInWeek < 0) {
        dayIndexInWeek = dayIndexInWeek + 7;
    }
    return dayIndexInWeek % 7;
}

export function getDayOfCurrentWeek(day:Days) : moment.Moment {
    return getDayOfWeek(day, moment());
}

export function getDayOfWeek(day:Days, time:moment.Moment) : moment.Moment {
    const weekStart = time.clone().startOf('isoWeek');
    return weekStart.add(day, "days");
}

export function isDayOfWeek(day:Days, time:moment.Moment) : boolean {
    // -1 because of Days enum uses ISO week, moment does not
    const actualDay = getDay(time.get('day')-1);
    return actualDay === day;
}

export function isWeekend(time:moment.Moment) : boolean {
    return isDayOfWeek(Days.SATURDAY, time) || isDayOfWeek(Days.SUNDAY, time);
}

export function getCalendarTypeText(calendarType: CalendarType) {
    switch(calendarType) {
        case "DAY": return "Tag";
        case "MONTH": return "Monat";
        case "WEEK":
        case "WORKWEEK": return "Woche";
        default: return "Not Implemented";
    }
}