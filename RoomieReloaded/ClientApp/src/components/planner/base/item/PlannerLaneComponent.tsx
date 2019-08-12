import * as React from 'react';

export interface IPlannerLaneComponentProps
{
    groupId:string,
    laneIndex:number,
    className?:string
}


class PlannerLaneComponent extends React.Component<IPlannerLaneComponentProps>
{
    render = () =>
    {        
        const {
            laneIndex,
            className,
        } = this.props;

        const lane = <div
                key={laneIndex}
                className={className}>
                <div>
                    {this.props.children}
                </div>
            </div>;
        
        return lane;
    }
}

export const PlannerLane = PlannerLaneComponent; 