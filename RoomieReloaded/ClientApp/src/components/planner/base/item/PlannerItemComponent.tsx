import React from 'react';
import { 
    TooltipHost,
    ITooltipProps,
    getId,
    DirectionalHint,
 } from 'office-ui-fabric-react';
import { IPoint } from 'office-ui-fabric-react/lib/utilities/positioning';
import { 
    IRenderablePlannerItem,
} from '../planner';

export interface IPlannerItemParentData
{
    parentName:string,
    getParentWidth:()  => number | undefined,
}

export interface IPlannerItemComponentProps
{
    item:IRenderablePlannerItem,
    itemIndex:number,
    parentIndex:number,
    leftFactor:number,
    widthFactor:number,
    isStartingInView:boolean,
    isEndingInView:boolean,
    parentDataFactory: (index:number) => IPlannerItemParentData,
}

interface IPlannerItemComponentState
{
    isTooltipVisible:boolean,
    rerender:boolean,
}


class PlannerItemComponent extends React.Component<IPlannerItemComponentProps, IPlannerItemComponentState>
{
    private tooltipId = getId("tooltip");
    private calloutTarget = React.createRef<HTMLSpanElement>();

    constructor(props:IPlannerItemComponentProps)
    {
        super(props);

        this.state = {
            isTooltipVisible:false,
            rerender:false,
        }
    }
    
    render(){
        const {
            itemIndex,
            isStartingInView,
            isEndingInView,
            item,
        } = this.props;

        const cssPositionProperties = this.createCssPositionProperties();
        const cssTextProperties = this.createCssTextProperties();
        const cssPresentationProperties = this.createCssPresentationProperties();

        const outerContainerClassName = "itemPartContainer-outer";
        const innerContainerClassName = "itemPartContainer-inner";

        const key = `item-${itemIndex}`;

        const itemElement =  <div
                className={innerContainerClassName} 
                style={cssPositionProperties}>
                <span ref={this.calloutTarget}>
                    <span
                        ref="item"
                        aria-describedby={this.state.isTooltipVisible ? this.tooltipId : undefined}          
                        className={"draggable-planner-item item-border" + (isStartingInView ? " start-item" : "") + (isEndingInView ? " end-item" : "") }
                        style={cssPresentationProperties}
                    >
                        <div className={"item-data"}>
                            <div className="plannertext item item-text" 
                                style={cssTextProperties}
                            >
                                {item.title}
                            </div>
                        </div>
                    </span>
                </span>
        </div>;

        return (
            <div className={outerContainerClassName} key={key} >
                <TooltipHost
                    id={this.tooltipId}
                    calloutProps={{ 
                        directionalHint: DirectionalHint.topCenter,
                        directionalHintFixed: true,
                        target: this.getTooltipPosition('top')
                    }}
                    onTooltipToggle={(isVisible:boolean) => this.setState({...this.state, isTooltipVisible:isVisible})}
                    hidden={!this.showTooltip()}
                    content="placeholder"
                    tooltipProps={{
                        onRenderContent:this.onRenderTooltip
                    }} >
                        {itemElement}
                </TooltipHost>
            </div>);
    }

    componentDidMount = () =>
    {
        // trigger rerender on size change
        window.addEventListener("resize", this.triggerRerender);
        // trigger rerender when parent fires the event
        window.addEventListener("rerenderItem", this.triggerRerender);
    }

    componentWillUnmount = () =>
    {
        window.removeEventListener("resize", this.triggerRerender);
        window.removeEventListener("rerenderItem", this.triggerRerender);
    }

    private triggerRerender = () =>
    {
        this.setState({...this.state, rerender:!this.state.rerender});
    }

    private showTooltip = () : boolean =>
    {
        const {
            item
        } = this.props;

        return item.id !== "";
    }

    private getTooltipPosition = (verticalAlign:'top'|'bottom') : IPoint | undefined =>
    {
        const {
            widthFactor,
            parentIndex,
            parentDataFactory,
        } = this.props;

        const item : any = this.refs.item;

        if(item === undefined){
            // not rendered yet
            return undefined;
        }

        const itemRect : DOMRect = item.getBoundingClientRect();

        const parentData = parentDataFactory(parentIndex);

        const parentWidth = parentData.getParentWidth() || 0;

        const width = parentWidth * widthFactor;

        const tooltipLeft = itemRect.left + width/2;
        const tooltipYCoord = verticalAlign === 'top' ? itemRect.top : itemRect.bottom;

        return {
            x:tooltipLeft,
            y:tooltipYCoord
        };
    }

    private onRenderTooltip = 
        (props?: ITooltipProps, defaultRender?: (props?: ITooltipProps) => JSX.Element | null) : JSX.Element | null =>
    {
        const {
            item
        } = this.props;

        const type = typeof(item.tooltip);

        const element = type === "string"
            ? <div>{item.tooltip}</div>
            : item.tooltip as JSX.Element || null;

        return element;
    }
    
    private createCssPresentationProperties() 
    {
        const {
            item,
        } = this.props;

        const cssProperties: React.CSSProperties = {
            opacity: 1,  
        };

        if (item.color) {
            cssProperties.backgroundColor = item.color;
        }

        return cssProperties;
    }
    
    private createCssPositionProperties() 
    {
        const {
            leftFactor,
            parentIndex,
            parentDataFactory,
        } = this.props;
        
        const parentWidth = parentDataFactory(parentIndex).getParentWidth();

        const actualLeft = this.getActualValue(parentWidth, leftFactor);
        const actualWidth = this.getActualWidth();

        const cssProperties: React.CSSProperties = {
            width: actualWidth,
            left: actualLeft,       
        };
        return cssProperties;
    }

    private createCssTextProperties()
    {
        let textWidth = this.canCalculateAbsoluteWidth()
            ? (this.getAbsoluteWidth() - 10) + "px"
            : "100%";

        const cssProperties: React.CSSProperties = {
            width: textWidth,    
        };
        return cssProperties;
    }

    private getActualWidth = () : string =>
    {
        return this.canCalculateAbsoluteWidth()
            ? this.getAbsoluteWidth() + "px"
            : this.getRelativeWidth() + "%";
    }

    private canCalculateAbsoluteWidth = () : boolean =>
    {
        const {
            parentDataFactory,
        } = this.props;
        const firstColumnIndex = this.getFirstColumnIndex();
        return parentDataFactory(firstColumnIndex).getParentWidth() !== undefined;
    }

    private getFullCoveredColumnWidth = () : number =>
    {
        const {
            parentDataFactory,
        } = this.props;
        
        const firstColumnIndex = this.getFirstColumnIndex();
        const lastColumnIndex = this.getLastColumnIndex();

        let width = 0;

        for (let index = firstColumnIndex + 1; index < lastColumnIndex; index++) {
            const parentData = parentDataFactory(index);
            width = width + (parentData.getParentWidth() || 0);            
        }

        return width;
    }

    private getWidthInLastColumn = () : number =>
    {
        const {
            leftFactor,
            widthFactor,
            parentDataFactory,
        } = this.props;

        const firstColumnIndex = this.getFirstColumnIndex();
        const lastColumnIndex = this.getLastColumnIndex();
        let lastColumnCovered = leftFactor + widthFactor + firstColumnIndex - lastColumnIndex;
        if(lastColumnCovered < 0)
        {
            return 0;
        }

        const lastColumnParent = parentDataFactory(lastColumnIndex);
        let lastColumnWidth = lastColumnParent.getParentWidth() || 0;
        return lastColumnWidth * lastColumnCovered;
    }

    private hasMoreThanOneColumnCovered = () : boolean =>
    {
        const {
            leftFactor,
            widthFactor,
        } = this.props;

        if(widthFactor > 1){
            return true;
        }
        return leftFactor + widthFactor > 1;
    }

    private getWidthInFirstColumn = () : number =>
    {
        const {
            leftFactor,
            widthFactor,
            parentDataFactory,
        } = this.props

        const firstColumnIndex = this.getFirstColumnIndex();

        const firstColumnCovered = this.hasMoreThanOneColumnCovered()
            ? 1 - leftFactor
            : widthFactor;

        const firstColumnParent = parentDataFactory(firstColumnIndex);
        let firstColumnWidth = firstColumnParent.getParentWidth() || 0;
        if(firstColumnWidth < 0)
        {
            firstColumnWidth = 0;
        }
        return firstColumnWidth * firstColumnCovered;
    }

    private getFirstColumnIndex = () : number =>
    {
        return this.props.parentIndex;
    }

    private getLastColumnIndex = () : number =>
    {
        const {
            leftFactor,
            widthFactor,
        } = this.props
        
        const firstColumnIndex = this.getFirstColumnIndex();

        const coveredColumnsCountStartingAtCurrentColumn = leftFactor + widthFactor;
        const relativIndexOfLastColumn = Math.floor(coveredColumnsCountStartingAtCurrentColumn);

        return firstColumnIndex + relativIndexOfLastColumn;
    }

    private getAbsoluteWidth = () : number => 
    {
        let actualWidth = this.getWidthInFirstColumn();
        if (this.hasMoreThanOneColumnCovered()) {
            actualWidth = actualWidth + this.getWidthInLastColumn();
            actualWidth = actualWidth + this.getFullCoveredColumnWidth();
        }
        return actualWidth;
    }

    private getRelativeWidth = () : number => 
    {
        return this.props.widthFactor * 100;
    }

    private getActualValue(parentWidth:number|undefined, value:number){
        return parentWidth === undefined
        ? value * 100 + "%"
        : ((parentWidth) * value) + "px"
    }
}

export const PlannerItem = PlannerItemComponent;