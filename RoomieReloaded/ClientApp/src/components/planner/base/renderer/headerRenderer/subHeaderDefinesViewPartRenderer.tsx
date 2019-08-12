import * as React from 'react';
import { HeaderRenderer } from './headerRenderer';

export class SubHeaderDefinesViewPartRenderer extends HeaderRenderer {
    
    renderTopHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[]{

        const headerValue = headerValues[0]; // should be only one here, ignore the rest
            
        const firstHeaderWidth = 102 * (subHeaderValues.length);
        
        const headerContents:JSX.Element[] = [
            this.renderHeaderContent(0, headerValue, firstHeaderWidth)
        ];
        
        const emptyHeaderCount = subHeaderValues.length - 1;

        for (let index = 1; index <= emptyHeaderCount; index++) {

            headerContents.push(this.renderHeaderContent(index, '', 0));
        }

        let index = 0;
        const result = headerContents.map(content => 
            {
                const additionalClassName = index === 0
                    ? 'first'
                    : index === emptyHeaderCount
                        ? 'last'
                        : '';
                return this.renderHeader(index++, content, additionalClassName, viewPartWidthPercent)
            }
        );

        return result;
    }

    private renderHeader(index:number, headerContent:JSX.Element, additionalClassName:string, widthInPercent:number):JSX.Element
    {
        const className = `divTableCell divTableHead divTableMainHeader divTableMainHeaderForContainer ${additionalClassName}`;
        const key = `header ${index}`;
        return (
            <div key={key} className={className}
                style={{width: `${widthInPercent}%`}}>
                <div className="mainHeaderContainer">
                    {headerContent}
                </div>                    
            </div>);
    }

    private renderHeaderContent(index:number, content:string, width:number):JSX.Element{

        const key = `header-content-${index}`;
        return (
            <div key={key}                 
                className={"mainHeaderContent plannertext"}
                style={{width:`${width}%`}}>
                {content}
            </div>
        );
    }

    renderBottomHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[]{
            
        let index = 0;

        const subHeaders = subHeaderValues.map(subHeader => 
            this.renderSubHeader(index++, subHeader, viewPartWidthPercent));
            return subHeaders;
        }


    private renderSubHeader(index:number, subHeader:string, widthInPercentPerViewPart:number) : JSX.Element{
        
        const key = `subHeader ${index}`;
        const className = `divTableCell divTableHead divTableMainHeader divTableMainHeaderSmall plannertext left ${(index > 0 ? "bordered" : "")}`;
        
        return (
            <div key={key} className={className}
                 style={{width: `${widthInPercentPerViewPart}%`}}>
                {subHeader}
            </div>
        );        
    }
}
