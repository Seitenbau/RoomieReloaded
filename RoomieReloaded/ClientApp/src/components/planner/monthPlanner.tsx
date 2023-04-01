import {Planner} from "./base";
import {IHasDateRange} from './base/plannerTypes';
import {IHeaderRenderer, SubHeaderDefinesViewPartRenderer} from './base/renderer/headerRenderer';

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

        return [
            date.format('MMMM YYYY')
        ];
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

    getHeaderRenderer(): IHeaderRenderer {
        return new SubHeaderDefinesViewPartRenderer();
    }
}