import moment from 'moment';
import {ICategoryState} from '../../../reducers/categoryReducer';
import { Action } from 'redux';

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
    category?: string,
    link?:string,
}

export interface IPlannerStateProps {
    date:moment.Moment,
    items:IPlannerItem[],
    groups:IPlannerGroup[],
    startHour:number,
    endHour:number,
    categoryStates: ICategoryState[],
}

export interface IPlannerDispatchProps{
    setCategoryState: (category:string, isCollapsed:boolean) => Action<any>,
}