import * as React from 'react';
import { IPlannerStateProps, IPlannerItem, IPlannerGroup, IHasDateRange } from './plannerTypes';
import './planner.css';
import { IHeaderRenderer } from './renderer/headerRenderer';
import { IItemRenderer, ItemRenderer } from './renderer/itemRenderer';
import { isItemTouchingRangeStrict, isDateTimeInRange } from '../utility/dateRangeHelper';
import { isWeekend } from '../utility/dateTimeHelper';
import { IPlannerItemParentData } from './item/PlannerItemComponent';
import { Spinner } from 'office-ui-fabric-react';
import { PlannerLane } from './item/PlannerLaneComponent';
import moment from 'moment';

export abstract class Planner extends React.Component<IPlannerStateProps>
{
    render = () => 
    {
        const result = (
            <div>
                <div className="divTable">
                    <div className="divTableBody">
                        {this.renderHeaders()}
                        {this.renderGroups()}
                    </div>
                </div> 
            </div>           
        );
        return result;
    }

    private renderHeaders = ():JSX.Element[] =>
    {
        const headers = this.getHeaderValues();
        const subHeaderValues = this.getSubHeaderValues();

        const groupHeaderWidthPercent = 12.5;

        const widthPerViewPart = this.getWidthPerViewPart(groupHeaderWidthPercent);
       
        const headerRenderer = this.getHeaderRenderer();

        return headerRenderer.renderHeaders(headers,
            subHeaderValues,
            groupHeaderWidthPercent,
            widthPerViewPart);
    }

    private renderGroups = () : JSX.Element[] =>
    {
        const {
            groups,
            items
        } = this.props;

        return groups.map(group => {
            const groupItems = items.filter(item => item.groupId === group.id)
                .sort((item1, item2 ) => this.sortDate(item1.start, item2.start));
            return this.renderGroup(group, groupItems);
        });
    }

    private sortDate(date1?: moment.Moment, date2?: moment.Moment): number {
        try{
            if(date1 === undefined){
                return date2 === undefined ? 0 : 1;
            }
            if(date2 === undefined){
                return -1;
            }

            //if(!date1.hasOwnProperty("diff")){
            //    return 1;
            //}

            return date1.diff(date2);
        }catch(e){
            console.log(date1)
            return 0;
        }
    }

    private createRenderableItem(item:IPlannerItem, index:number):IRenderablePlannerItem{
        return {
            ...item,
            laneIndex:index,
        };
    }

    private distributeItemsToLanes(groupId:string, items:IPlannerItem[]):IRenderablePlannerItem[]
    {
        const lanes:IPlannerItem[][] = [];

        items.forEach(item => 
        {
            let foundLane : IPlannerItem[] | null = null;

            for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
                const lane = lanes[laneIndex];
                if(this.itemFitsLane(item, lane)){
                    foundLane = lane;
                    break;
                }
            }
            if(foundLane === null){
                foundLane = [];                
                lanes.push(foundLane);
            }

            foundLane.push(item);
        });

        const result:IRenderablePlannerItem[] = [];
        
        for (let laneIndex = 0; laneIndex < lanes.length; laneIndex++) {
            const lane = lanes[laneIndex];
            lane.forEach(laneItem => {
                result.push(this.createRenderableItem(laneItem, laneIndex));
            });
        }

        return result;
    }

    private itemFitsLane(item:IPlannerItem, lane:IPlannerItem[]):boolean
    {
        for (let index = 0; index < lane.length; index++) {
            const laneItem = lane[index];
            if(isItemTouchingRangeStrict(item, laneItem))
            {
                return false;
            }
        }
        return true;
    }

    private calculateLaneCount(items:IRenderablePlannerItem[]):number
    {
        let highestIndex = 0;
        items.forEach(item => {
            if(item.laneIndex > highestIndex){
                highestIndex = item.laneIndex;
            }
        });

        return highestIndex + 1;
    }

    private renderGroup(group:IPlannerGroup, groupItems:IPlannerItem[]) : JSX.Element
    {
        const viewPartRanges = this.getViewPartRanges();

        const itemsInViewRange = groupItems.filter(item => this.isItemShownInAnyRange(item, viewPartRanges));

        const columns : any[] = [];

        const actualGroupItems = this.distributeItemsToLanes(group.id, itemsInViewRange);
        
        const laneCount = this.calculateLaneCount(actualGroupItems);

        for (let viewPartIndex = 0; viewPartIndex < viewPartRanges.length; viewPartIndex++) {
            
            const viewPart = viewPartRanges[viewPartIndex];
            const previousViewPart = viewPartRanges[viewPartIndex-1];
            
            const rangeFromPreviousViewPart:IHasDateRange = {
                start: previousViewPart === undefined 
                    ? viewPart.start.clone().startOf('day')
                    : previousViewPart.end,
                end:viewPart.end
            } 

            const itemsToRender = actualGroupItems.filter(
                item => this.isItemRenderingStartingInRange(item, rangeFromPreviousViewPart, viewPartIndex === 0)
            );

            const key = this.getParentRefKey(group.id, viewPartIndex);
            
            columns.push(
                <div key={key} ref={key} className={`divTableCell padded dataCell ${(isWeekend(viewPart.start) ? 'weekend' : '')}`}
                >
                    {this.renderItems( itemsToRender, laneCount, viewPartIndex, group.id, viewPartRanges )}
                </div>);
        };

        const imageStyle = group.imageSource
            ? ({backgroundImage:"url(" + group.imageSource + ")"})
            : undefined;

        const optionalImage = (
            <div className="header-image-container">
                <div className="header-image"
                    style={imageStyle}>
            </div>
        </div>);

        const optionalSpinner = group.isLoading
            ? <Spinner className="header" />
            : null;

        return (
            <div key={`group:${group.id}`} className="divTableRow">
                <div key={`group:${group.id}-header`} 
                    className="divTableCell padded" >
                    <div className="rowHeaderCell" >
                        <div className="rowHeaderInner">
                            {optionalImage}
                            <span className="header">{group.title}</span>
                            {optionalSpinner}
                        </div>
                    </div>
                </div>                
                {columns}
            </div>
        );
    }
        
    private getParentRefKey = (groupId: string, index: number) : string => 
    {
        return `group-${groupId}--day-${index}`;
    }

    private renderItems = ( items:IRenderablePlannerItem[], 
        laneCount:number,
        currentColumnRangeIndex:number,
        groupId:string,
        allColumnRanges:IHasDateRange[]) : JSX.Element[] =>
    {
        const lanes : JSX.Element[] = [];

        const itemRenderer = this.getItemRenderer(groupId);

        for (let laneIndex = 0; laneIndex < laneCount; laneIndex++)
        {
            const laneItems = items.filter(item => item.laneIndex === laneIndex);
            const renderedItems = itemRenderer.renderItems(
                laneItems, 
                currentColumnRangeIndex,
                allColumnRanges
            );

            lanes.push(<PlannerLane
                key={laneIndex}
                groupId={groupId}
                laneIndex={laneIndex}
                className="lane"                
            >
                {renderedItems}
            </PlannerLane>);
        }

        return lanes;
    }

    private getItemRenderer = (groupId:string) : IItemRenderer =>
    {
        return new ItemRenderer(
            (index:number) => this.parentDataFactory(index, groupId)
        );
    }

    private parentDataFactory = (index:number, groupId:string) : IPlannerItemParentData =>
    {
        const parentRefKey = this.getParentRefKey(groupId, index);
        const parentData: IPlannerItemParentData = this.getParentData(parentRefKey);
        return parentData;
    }
    
    private isItemShownInAnyRange = (item:IPlannerItem, ranges:IHasDateRange[]) : boolean =>
    {
        for (let index = 0; index < ranges.length; index++) {
            const element = ranges[index];
            if(this.isItemShownInRange(item, element))
            {
                return true;
            }            
        }
        return false;
    }

    private isItemShownInRange = (item:IPlannerItem, range:IHasDateRange) : boolean => 
    {
        return isItemTouchingRangeStrict(item, range);
    }

    private getParentData = (parentRefKey: string) : IPlannerItemParentData =>
    {
        const parentData: IPlannerItemParentData = {
            parentName: parentRefKey,
            getParentWidth: () => this.getParentWidth(parentRefKey),
        };
        return parentData;
    }

    private isItemRenderingStartingInRange(item:IRenderablePlannerItem, range:IHasDateRange, addItemsStartedBeforeRange:boolean) : boolean{
        
        if(isDateTimeInRange(item.start, range))
        {
            // item actually starts in range
            return true;
        }

        if(!addItemsStartedBeforeRange){
            return false;
        }

        // item is shown but started before the current range
        const result = item.start.isBefore(range.start);
        return result;
    }

    getTimeString(hour:number) : string {
        return hour < 10
            ? `0${hour}:00`
            : `${hour}:00`;
    }

    getWidthPerViewPart(groupHeaderWidthPercent:number):number{

        const space = 100 - groupHeaderWidthPercent;

        const viewPartCount = this.getViewPartRanges().length;

        return space / viewPartCount;
    }

    componentDidMount() {
        // rerender items via event after finished mounting to remove that strange quirky 'snap' when mouse hovering an item
        this.rerenderItems();
    }

    componentDidUpdate()
    {
        this.rerenderItems();
    }

    private rerenderItems()
    {
        let event;
        if(typeof(Event) === 'function')
        {
            event = new Event("rerenderItem");
        }
        else
        {
            // IE11 fallback
            event = document.createEvent('Event');
            event.initEvent('rerenderItem', true, true);
        }
        
        window.dispatchEvent(event);
    }  

     private getParentBoundingRect = (parentRefKey:string) : DOMRect|undefined =>
    {
        const parent : any = this.refs[parentRefKey];
        if(parent === undefined){
            return undefined;
        }

        const rect : DOMRect = parent.getBoundingClientRect();
        return rect;
    }

    private getParentWidth = (parentRefKey:string) : number|undefined =>
    {
        const rect = this.getParentBoundingRect(parentRefKey);
        return rect ? rect.width : undefined;
    }

    abstract getDaysToRender():number;
    abstract getDragIntervalInMinutes():number;
    abstract getHoursShownPerColumn():number;
    abstract getViewRange():IHasDateRange;
    abstract getShownViewRange():IHasDateRange;
    abstract getViewPartRanges():IHasDateRange[];
    abstract getHeaderValues():string[];
    abstract getSubHeaderValues():string[];   
    abstract getHeaderRenderer():IHeaderRenderer;
    
}

export interface IRenderablePlannerItem extends IPlannerItem {
    laneIndex:number,
}