import { IHasDateRange } from "../base/plannerTypes";
import * as moment from 'moment';

export function isItemTouchingRange(item:IHasDateRange, range:IHasDateRange) : boolean 
{
    const actualRange = getActualRange(range);
    try{

        return (
            isDateTimeInRange(item.start, actualRange) ||
            isDateTimeInRange(item.end, actualRange) ||
            (item.start.isSameOrBefore(actualRange.start) && item.end.isSameOrAfter(actualRange.end))
        );
    }
    catch(e){
        console.log(e);
        console.log(item)
        console.log(range)
        return false;
    }
}

export function isItemTouchingRangeStrict(item:IHasDateRange, range:IHasDateRange) : boolean 
{
    const actualRange = getActualRange(range);
    return (
        isDateTimeInRangeStrict(item.start, actualRange) ||
        isDateTimeInRangeStrict(item.end, actualRange) ||
        (item.start.isSameOrBefore(actualRange.start) && item.end.isSameOrAfter(actualRange.end))
    );
}

export function isItemInRange(item:IHasDateRange, range:IHasDateRange) : boolean
{
    const actualRange = getActualRange(range);
    return isDateTimeInRange(item.start, actualRange) && isDateTimeInRange(item.end, actualRange);
}

export function isDateTimeInRange(dateTime:moment.Moment, range:IHasDateRange) : boolean
{
    const actualRange = getActualRange(range);
    return actualRange.start.isSameOrBefore(dateTime) &&
        dateTime.isSameOrBefore(actualRange.end);
}

export function isDateTimeInRangeStrict(dateTime:moment.Moment, range:IHasDateRange) : boolean
{
    const actualRange = getActualRange(range);
    try{
        return actualRange.start.isBefore(dateTime) &&
        dateTime.isBefore(actualRange.end);
    }catch(e){
        console.log(e)
        console.log(dateTime)
        console.log(range)
        return false;
    }
}

function getActualRange(range:IHasDateRange) : IHasDateRange 
{
    const doFlip = range.start > range.end;

    return doFlip
        ? {
            start:range.end.clone(),
            end:range.start.clone()
        }
        : range;
}