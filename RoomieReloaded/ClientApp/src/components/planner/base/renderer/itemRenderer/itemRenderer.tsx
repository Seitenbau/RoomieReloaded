import { IHasDateRange } from '../../plannerTypes';
import { IRenderablePlannerItem } from '../../planner';

export interface IItemRenderer
{
    renderItems(
        items:IRenderablePlannerItem[], 
        currentColumnIndex:number,
        allColumnRanges:IHasDateRange[],
    ) : JSX.Element;
}