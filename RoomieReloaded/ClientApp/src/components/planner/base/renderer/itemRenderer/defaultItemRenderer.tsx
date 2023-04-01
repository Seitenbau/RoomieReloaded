import React from 'react';
import moment from 'moment';
import { IItemRenderer } from './itemRenderer';
import { IRenderablePlannerItem } from '../../planner';
import { IHasDateRange } from '../../plannerTypes';
import { isDateTimeInRange, isItemInRange, isItemTouchingRange } from '../../../utility/dateRangeHelper';
import { IPlannerItemParentData, PlannerItem } from '../../item/PlannerItemComponent';

export class ItemRenderer implements IItemRenderer
{
    private readonly parentDataFactory: (index:number) => IPlannerItemParentData;

    constructor(
        parentDataFactory: (index:number) => IPlannerItemParentData)
    {
        this.parentDataFactory = parentDataFactory;
    }

    renderItems = (
        items:IRenderablePlannerItem[], 
        currentColumnIndex:number,
        allColumnRanges:IHasDateRange[]) : JSX.Element => 
    {
        const result : JSX.Element[] = [];

        const currentColumnRange = allColumnRanges[currentColumnIndex];

        const startHour = currentColumnRange.start.hour();
        let endHour = currentColumnRange.end.hour();
        if(endHour === 0){
            endHour = 24;
        }
        
        const dayHours = endHour - startHour;

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++)
        {
            const element = items[itemIndex];

            const virtualItemStart = this.getLaterMoment(currentColumnRange.start, element.start);

            const startOffsetHours = this.getDifferenceInHours(currentColumnRange.start, virtualItemStart);
            const relativeStartOffset = startOffsetHours / dayHours;

            const relativeDuration = this.getCoveredRangeCount(allColumnRanges, element);

            const isStartingInCurrentView = this.isDatetimeInAnyRange(element.start, allColumnRanges);
            const isEndingInCurrentView = this.isDatetimeInAnyRange(element.end, allColumnRanges);

            result.push(
                <PlannerItem
                    key={itemIndex}
                    item={element}
                    itemIndex={itemIndex}
                    parentIndex={currentColumnIndex}
                    isStartingInView={isStartingInCurrentView}
                    isEndingInView={isEndingInCurrentView}
                    leftFactor={relativeStartOffset}
                    widthFactor={relativeDuration}
                    parentDataFactory={this.parentDataFactory}
                />
            );
        }

        return (
            <div >
                {result}
            </div>
        );
    }

    private getCoveredRangeCount = (columnRanges: IHasDateRange[], item: IHasDateRange) : number =>
    {
        let coveredColumnRangeCount = 0;
        for (const columnRange of columnRanges) {
            if(!isItemTouchingRange(item, columnRange))
            {
                continue;
            }

            if (this.isCoveringRange(columnRange, item)) {
                coveredColumnRangeCount = coveredColumnRangeCount + 1;
                continue;
            }

            const columnLength = columnRange.end.diff(columnRange.start);
            const columnLengthDuration = moment.duration(columnLength);
            const columnLengthInHours = columnLengthDuration.asHours();

            if(columnLengthInHours > 0)
            {
                const virtualItemStart = this.getLaterMoment(columnRange.start, item.start);
                const hoursUntilStart = this.getPositiveDifferenceInHours(columnRange.start, virtualItemStart);

                const virtualItemEnd = this.getEarlierMoment(columnRange.end, item.end);    
                const hoursUntilEnd = this.getPositiveDifferenceInHours(virtualItemEnd, columnRange.end);

                const itemPartInRangeInHours = columnLengthInHours - hoursUntilEnd - hoursUntilStart;
                const relativeItemLength = itemPartInRangeInHours / columnLengthInHours;
                coveredColumnRangeCount = coveredColumnRangeCount + relativeItemLength;
            }
        }

        return coveredColumnRangeCount;
    }

    private getEarlierMoment = (first:moment.Moment, second:moment.Moment) : moment.Moment =>
    {
        if(first.isBefore(second)){
            return first;
        }
        return second;
    }

    private getLaterMoment = (first:moment.Moment, second:moment.Moment) : moment.Moment =>
    {
        if(first.isBefore(second)){
            return second;
        }
        return first;
    }

    private getPositiveDifferenceInHours = (first:moment.Moment, second:moment.Moment) : number =>
    {
        const hours = this.getDifferenceInHours(first, second);
        return hours < 0
            ? 0
            : hours;
    }

    private getDifferenceInHours = (first:moment.Moment, second:moment.Moment) : number =>
    {
        const difference = second.diff(first);
        const duration = moment.duration(difference);
        return duration.asHours();
    }

    private isCoveringRange = (columnRange: IHasDateRange, item: IHasDateRange) : boolean => 
    {
        return isItemInRange(columnRange, item);
    }

    private isDatetimeInAnyRange = (dateTime:moment.Moment, ranges:IHasDateRange[]) : boolean =>
    {
        for (const range of ranges) {
            if(isDateTimeInRange(dateTime, range)){
                return true;
            }
        }
        return false;
    }
}