import { createActions, createReducer } from 'reduxsauce';
import { ISauceTypes } from '.';
import { Action } from 'redux';
import { IPlannerItem } from '../components/planner/base/plannerTypes';
import { requestActions, IRequestTypes, IRequestCreators, IRequestState, initialRequestState } from '../actions/actions';

const {Types,Creators}: ISauceTypes<ILocalTypes, ILocalCreators> = createActions({
    ...requestActions,
    mapRecords:null,
    updateItems:['value'],
},{
    prefix: 'PLANNER_ITEMS_',
});

interface ILocalTypes extends IRequestTypes {
    MAP_RECORDS:string;
    UPDATE_ITEMS:string;
}
interface ILocalCreators extends IRequestCreators {
    mapRecords:() => Action<any>;
    updateItems:(value:any) => Action<any>;
}
interface ILocalState extends IRequestState {
    items:IPlannerItem[];
}

export type PlannerItemsState = Readonly<ILocalState>;

const initialState: ILocalState = {
    ...initialRequestState,
    items:[],
}

export const PlannerItemsTypes = Types;
export const PlannerItemsActions = Creators;

const updateItems = (state:any, { value }:any) => ({ ...state, items:value });

export const plannerItemsReducer = createReducer(initialState, {
    [Types.UPDATE_ITEMS]:updateItems,
});