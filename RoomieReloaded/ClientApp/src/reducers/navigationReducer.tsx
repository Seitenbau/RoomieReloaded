import { createActions, createReducer } from 'reduxsauce';
import { ISauceTypes } from '.';
import { VoidCreator, AnyValueCreator } from '../actions/actions';

const {Types,Creators}: ISauceTypes<ILocalTypes, ILocalCreators> = createActions({
    onMonthClick:null,
    onWeekClick:null,
    onDayClick:null,
    onNextTimeFrameClick:null,
    onPreviousTimeFrameClick:null,
    onTodayClick:null,
    onTimeFrameSelected:['value'],
    onNavigateToItem:['value']
},{
    prefix: 'NAVIGATION_',
});

interface ILocalTypes {
    ON_MONTH_CLICK:string;
    ON_WEEK_CLICK:string;
    ON_DAY_CLICK:string;
    ON_NEXT_TIME_FRAME_CLICK:string;
    ON_PREVIOUS_TIME_FRAME_CLICK:string;
    ON_TODAY_CLICK:string;
    ON_TIME_FRAME_SELECTED:string;
    ON_NAVIGATE_TO_ITEM:string;
}

export interface ILocalCreators {
    onMonthClick:VoidCreator;
    onWeekClick:VoidCreator;
    onDayClick:VoidCreator;
    onNextTimeFrameClick:VoidCreator;
    onPreviousTimeFrameClick:VoidCreator;
    onTimeFrameSelected:AnyValueCreator;
    onTodayClick:VoidCreator;
    onNavigateToItem:VoidCreator;
}

export const NavigationTypes = Types;
export const NavigationActions = Creators;

interface ILocalState{}

export type NavigationState = Readonly<ILocalState>;
export type NavigationCreators = Readonly<ILocalCreators>;

const INITIAL_STATE: ILocalState = ({})
export const navigationReducer = createReducer(INITIAL_STATE, {
});