import * as React from 'react';

export interface IHeaderRenderer{
    renderHeaders(headerValues:string[],
        subHeaderValues:string[],
        groupHeaderWidthPercent:number,
        viewPartWidthPercent:number):JSX.Element[];
}

export abstract class HeaderRenderer implements IHeaderRenderer {
    
    renderHeaders(headerValues:string[],
        subHeaderValues:string[],
        groupHeaderWidthPercent:number,
        viewPartWidthPercent:number):JSX.Element[] {
        
            const topRow = (
                <div key="mainHeaders" className="divTableRow">
                    {this.renderTopGroupHeader(groupHeaderWidthPercent)}
                    {this.renderTopHeaders(headerValues, subHeaderValues, viewPartWidthPercent)}
                </div>
            );
            const bottomRow = (
                <div key="subHeaders" className="divTableRow">
                    {this.renderBottomGroupHeader(groupHeaderWidthPercent)}
                    {this.renderBottomHeaders(headerValues, subHeaderValues, viewPartWidthPercent)}
                </div>
            );

            return [
                topRow,
                bottomRow
            ];

    }

    private renderTopGroupHeader(widthInPercent:number) : JSX.Element{
        const className = "divTableCell divTableHead top";
        return this.renderGroupHeader(widthInPercent, className);
    }

    private renderBottomGroupHeader(widthInPercent:number) : JSX.Element{
        const className = "divTableCell divTableHead bottom";
        return this.renderGroupHeader(widthInPercent, className);
    }

    private renderGroupHeader(widthInPercent:number, className:string) : JSX.Element{
        return (
            <div key="header 0" className={className}
                 style={{width:`${widthInPercent}%`}}>
                <div className="divTableMainHeader"></div>
            </div>
        );
    }

    abstract renderTopHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[];
    abstract renderBottomHeaders(headerValues:string[],
        subHeaderValues:string[],
        viewPartWidthPercent:number):JSX.Element[];
}
