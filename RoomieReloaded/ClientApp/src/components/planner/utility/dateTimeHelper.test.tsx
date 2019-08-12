import { getDayOfWeek, Days, getDay, getDayOfCurrentWeek, isDayOfWeek, isWeekend } from "./dateTimeHelper";
import  moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const baseDay = moment('2018-11-14', dateFormat);

 describe('dateTimeHelper.getDayOfWeek', () => {
     it('Monday', () => {
        testDay(Days.MONDAY, '2018-11-12');
     }),
     it('Tuesday', () => {
        testDay(Days.TUESDAY, '2018-11-13');
     }),
     it('Wednesday', () => {
        testDay(Days.WEDNESDAY, '2018-11-14');
     }),
     it('Thursday', () => {
        testDay(Days.THURSDAY, '2018-11-15');
     }),
     it('Friday', () => {
        testDay(Days.FRIDAY, '2018-11-16');
     }),
     it('Saturday', () => {
        testDay(Days.SATURDAY, '2018-11-17');
     }),
     it('Sunday', () => {
        testDay(Days.SUNDAY, '2018-11-18');
     })
 })

 function testDay(day:Days, expectedResult:string){

    const result = getDayOfWeek(day, baseDay);

    expect(result.format()).toBe(moment(expectedResult,dateFormat).format())
 }

 describe('dateTimeHelper.getDay', () => {
     it('0 = Monday', () => {
         expect(getDay(0)).toBe(Days.MONDAY);
     }),
     it('1 = Tuesday', () => {
         expect(getDay(1)).toBe(Days.TUESDAY);
     }),
     it('2 = Wednesday', () => {
         expect(getDay(2)).toBe(Days.WEDNESDAY);
     }),
     it('3 = Thursday', () => {
         expect(getDay(3)).toBe(Days.THURSDAY);
     }),
     it('4 = Friday', () => {
         expect(getDay(4)).toBe(Days.FRIDAY);
     }),
     it('5 = Saturday', () => {
         expect(getDay(5)).toBe(Days.SATURDAY);
     }),
     it('6 = Sunday', () => {
         expect(getDay(6)).toBe(Days.SUNDAY);
     })
 })

 it('dateTimeHelper.getDayOfCurrentWeek', () => {
    const today = moment().startOf('day');
    const dayIndex = moment().day() - 1; // moment.js week starts at sunday

    const day = getDay(dayIndex);

    const result = getDayOfCurrentWeek(day);

    expect(result.format()).toEqual(today.format());
 });

 describe('dateTimeHelper.isDayOfWeek', () => {
     it('is MONDAY', () => {
        testIsDayOfWeek(Days.MONDAY);
     }),
     it('is TUESDAY', () => {
        testIsDayOfWeek(Days.TUESDAY);
     }),
     it('is WEDNESDAY', () => {
        testIsDayOfWeek(Days.WEDNESDAY);
     }),
     it('is THURSDAY', () => {
        testIsDayOfWeek(Days.THURSDAY);
     }),
     it('is FRIDAY', () => {
        testIsDayOfWeek(Days.FRIDAY);
     }),
     it('is SATURDAY', () => {
        testIsDayOfWeek(Days.SATURDAY);
     }),
     it('is SUNDAY', () => {
        testIsDayOfWeek(Days.SUNDAY);
     })
 });

function testIsDayOfWeek(day:Days){
    const time = getDayOfWeek(day, moment());
    const result = isDayOfWeek(day, time);
    expect(result).toBe(true);
}

describe('dateTimeHelper.isWeekend', () => {
    it('isWeekend MONDAY', () => {
        testIsWeekend(Days.MONDAY, false);
    }),
    it('is TUESDAY', () => {
        testIsWeekend(Days.TUESDAY, false);
    }),
    it('is WEDNESDAY', () => {
        testIsWeekend(Days.WEDNESDAY, false);
    }),
    it('is THURSDAY', () => {
        testIsWeekend(Days.THURSDAY, false);
    }),
    it('is FRIDAY', () => {
        testIsWeekend(Days.FRIDAY, false);
    }),
    it('is SATURDAY', () => {
        testIsWeekend(Days.SATURDAY, true);
    }),
    it('is SUNDAY', () => {
        testIsWeekend(Days.SUNDAY, true);
    })
});

function testIsWeekend(day:Days, expectedResult:boolean){
    const time = getDayOfWeek(day, moment());
    const result = isWeekend(time);
    expect(result).toBe(expectedResult);
}