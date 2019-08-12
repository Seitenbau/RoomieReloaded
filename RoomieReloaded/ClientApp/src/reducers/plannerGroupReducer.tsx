import {createActions, createReducer} from 'reduxsauce';
import { 
    requestActions, 
    IRequestTypes, 
    IRequestCreators, 
    IRequestState, 
    initialRequestState, 
    defaultRequest, 
    defaultSuccess, 
    defaultFailure 
} from "../actions/actions";
import { ISauceTypes } from '.';
import { IPlannerGroup } from '../components/planner/base/plannerTypes';
import { Action } from 'redux';

const {Types,Creators}: ISauceTypes<ILocalTypes, ILocalCreators> = createActions({
    ...requestActions,
    updateGroups:['value'],
    setGroupsLoading:['value'],
},{
    prefix: 'PLANNER_GROUPS_',
});

interface ILocalTypes extends IRequestTypes{
    UPDATE_GROUPS:string;
    SET_GROUPS_LOADING:string;
}
interface ILocalCreators extends IRequestCreators{
    updateGroups:(value:any) => Action<any>;
    setGroupsLoading:(value:any) => Action<any>;
}
interface ILocalState extends IRequestState{
    groups:IPlannerGroup[];
}

export type PlannerGroupState = Readonly<ILocalState>;

const initialState: ILocalState = {
    ...initialRequestState,
    groups:[],
}

export const PlannerGroupTypes = Types;
export const PlannerGroupActions = Creators;

const updateGroups = (state:any, { value }:any) => ({ ...state, groups:value });
const setGroupsLoading = (state: any, { value }:any) => 
{    
    const currentGroups : IPlannerGroup[] = state.groups;

    const groupsToChange = currentGroups.filter(group => value.groupIds.indexOf(group.id) > -1 && group.isLoading !== value.isLoading);
    const unchangedGroups = currentGroups.filter(group => groupsToChange.indexOf(group) < 0);

    for (const groupToChange of groupsToChange) {
        groupToChange.isLoading = value.isLoading;
    }
    const newGroups = groupsToChange.concat(unchangedGroups);

    return {
        ...state,
        groups:newGroups
    };
}

export const plannerGroupReducer = createReducer(initialState, {
    [Types.REQUEST]:defaultRequest,
    [Types.SUCCESS]:defaultSuccess,
    [Types.FAILURE]:defaultFailure,
    [Types.UPDATE_GROUPS]:updateGroups,
    [Types.SET_GROUPS_LOADING]:setGroupsLoading,
});