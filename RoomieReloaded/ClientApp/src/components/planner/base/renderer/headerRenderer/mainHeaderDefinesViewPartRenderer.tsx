import * as React from 'react';
import { HeaderRenderer } from './headerRenderer';

export class MainHeaderDefinesViewPartRenderer extends HeaderRenderer {


    renderTopHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[]{

        const additionalClassName = `${(subHeaderValues ? 'bordered' : '')}`;

        let index = 1;
        return headerValues.map(headerValue => this.renderHeader(index++,
            headerValue,
            additionalClassName,
            viewPartWidthPercent))
    }

    private renderHeader(index:number, headerValue:string, additionalClassName:string, widthInPercent:number):JSX.Element
    {
        const className = `divTableCell divTableHead divTableMainHeader plannertext ${additionalClassName}`
        const key = `header ${index}`;
        return (
            <div key={key} className={className}
                style={{width: `${widthInPercent}%`}}>
                    {headerValue}
            </div>);
    }

    renderBottomHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[]{

        let index= 0;
        return headerValues.map(_ => this.renderSubHeaders(index++,subHeaderValues));
    }

    private renderSubHeaders(upperIndex:number,subHeaderValues:string[]) : JSX.Element
    {
        const subHeaderCount = subHeaderValues.length;

        const key = `upperSubHeader ${upperIndex}`;
        let index = 0;
        return (
             <div key={key} className="divTableCell divTableHead">
                <div className="divTableSubHeader plannertext">
                    {subHeaderValues.map(subHeader => 
                        this.renderSubHeader(index++, subHeader, subHeaderCount))
                    }
                </div>
            </div>
        );
    }

    private renderSubHeader(index:number, subHeader:string, subHeaderCount:number) : JSX.Element{
        
        const key = `subHeader ${index}`;
        const className = `subHeader plannertext ${(index === 0 ? "left" : (index === subHeaderCount-1 ? "right" : ""))} ${(index > 0 ? "withBorder" : "")}`;
        
        return (
            <span key={key} className={className}>
                {subHeader}
            </span>
        );        
    }
}