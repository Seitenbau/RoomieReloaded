import moment from 'moment';

export interface IHasDateRange {
    start:moment.Moment,
    end:moment.Moment,
}

export interface IPlannerItem extends IHasDateRange {
    id: string,
    title: string | JSX.Element,
    groupId: string,
    className?: string,
    color?: string,
    tooltip?:string | JSX.Element,
    chatLink?:string,
    chatMessage?: string,
    isPrivate:boolean,
}

export interface IPlannerGroup{
    id:string,
    title:string,
    isLoading:boolean,
    imageSource?:string,
}

export interface IPlannerStateProps {
    date:moment.Moment,
    items:IPlannerItem[],
    groups:IPlannerGroup[],
    startHour:number,
    endHour:number,
}