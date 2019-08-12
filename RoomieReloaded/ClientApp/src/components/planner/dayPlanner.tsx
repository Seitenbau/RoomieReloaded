import { Planner } from "./base/planner";
import { IHasDateRange } from './base/plannerTypes';
import { IHeaderRenderer, SubHeaderDefinesViewPartRenderer } from './base/renderer/headerRenderer';

export class DayPlanner extends Planner{

    getDaysToRender():number{
        return 1;
    }

    getViewRange():IHasDateRange{
        const {date, startHour, endHour} = this.props;

        const startOfDay = date.startOf('day');
        const dayStart = startOfDay.clone()
            .add(startHour, 'hours');
        const dayEnd = startOfDay.clone()
            .add(endHour, 'hours');

        const result : IHasDateRange = {
            start:dayStart,
            end:dayEnd
        };

        return result;
    }

    getShownViewRange = ():IHasDateRange =>
    {
        return this.getViewRange();
    }

    getHoursShownPerColumn = ():number =>
    {
        return 1;
    }

    getDragIntervalInMinutes():number
    {
        return 5;
    }

    getViewPartRanges():IHasDateRange[]{
        const { startHour, endHour} = this.props;
        
        const viewRange = this.getViewRange();
        const viewPartRanges : IHasDateRange[] = [];
        
        for (let hour = 0; hour < endHour-startHour; hour++){
            
            const hourStart = viewRange.start.clone().add(hour, 'hours');
            const hourEnd = hourStart.clone().add(1, 'hour');
            
            const viewPart : IHasDateRange = {start:hourStart, end:hourEnd };
                        
            viewPartRanges.push(viewPart);
        }

        return viewPartRanges;
    }

    getHeaderValues():string[] {
        const {date} = this.props;
        
        const headerStrings : string[] = [
            date.format('dddd, DD.MM.')
        ];
        return headerStrings;
    }

    getSubHeaderValues():string[]    
    {
        const{
            startHour,
            endHour
        } = this.props;
        
        const subHeaderValues : string[] = [];
        
        const actualEndHour = endHour === 0
            ? 24
            : endHour;

        for (let hour = startHour; hour < actualEndHour; hour++){
            subHeaderValues.push(this.getTimeString(hour));
        }

        return subHeaderValues;
    }

    getSubheadersDefineViewParts():boolean{
        return true;
    }

    getHeaderRenderer(): IHeaderRenderer{
        return new SubHeaderDefinesViewPartRenderer();
    }
}