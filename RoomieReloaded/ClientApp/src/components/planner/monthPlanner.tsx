import { Planner } from "./base/planner";
import { IHasDateRange } from './base/plannerTypes';
import { SubHeaderDefinesViewPartRenderer, IHeaderRenderer } from './base/renderer/headerRenderer';

export  class MonthPlanner extends Planner{
    
    getDaysToRender():number
    {
        const{date} = this.props;
        return date.daysInMonth();
    }

    getViewRange():IHasDateRange{
        const {date} = this.props;

        const start = date.clone().startOf('month');
        const end = date.clone().endOf('month');
        return {
            start,
            end
        };
    }

    getShownViewRange = ():IHasDateRange =>
    {
        const{
            startHour,
            endHour
        } = this.props;
        
        const lastDayHoursSubtract = 24 - endHour;
        const viewRange = this.getViewRange();

        return {
            start:viewRange.start.add(startHour, 'hours'),
            end:viewRange.end.subtract(lastDayHoursSubtract, 'hours')
        };
    }

    getHoursShownPerColumn = ():number =>
    {
        const{
            startHour,
            endHour
        } = this.props;
        return endHour - startHour;
    }

    getDragIntervalInMinutes():number
    {
        return 60;
    }

    getViewPartRanges():IHasDateRange[]{
        const { startHour, endHour} = this.props;
        
        const viewRange = this.getViewRange();

        const dayRanges : IHasDateRange[] = [];
        const daysToRender = this.getDaysToRender();

        for (let index = 0; index < daysToRender; index++) {

            const dayStart = viewRange.start.clone().add(index, 'days');

            const startDateTime = dayStart.clone().add(startHour, 'hours');
            const endDateTime = dayStart.clone().add(endHour, 'hours');
            
            const dayRange : IHasDateRange = {start:startDateTime, end:endDateTime };
                        
            dayRanges.push(dayRange);
        }

        return dayRanges;
    }

    getHeaderValues():string[] {
        const {date} = this.props;

        const headerStrings : string[] = [
            date.format('MMMM YYYY')
        ];

        return headerStrings;
    }

    getSubHeaderValues():string[]    
    {
        const daysToRender = this.getDaysToRender();
        
        const subHeaderValues : string[] = [];

        for (let day = 1; day <= daysToRender; day++){
            subHeaderValues.push(day + ".");
        }

        return subHeaderValues;
    }

    getSubheadersDefineViewParts():boolean{
        return true;
    }

    getHeaderRenderer(): IHeaderRenderer {
        return new SubHeaderDefinesViewPartRenderer();
    }
}