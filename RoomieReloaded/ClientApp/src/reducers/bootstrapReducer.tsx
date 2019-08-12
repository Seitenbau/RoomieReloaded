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

const {Types,Creators}: ISauceTypes<ILocalTypes, ILocalCreators> = createActions({
    ...requestActions
},{
    prefix: 'BOOTSTRAP_',
});

interface ILocalTypes extends IRequestTypes{
}
interface ILocalCreators extends IRequestCreators{
}
interface ILocalState extends IRequestState{
}

export type BootstrapState = Readonly<ILocalState>;

const initialState: ILocalState = {
    ...initialRequestState,
}

export const BootstrapTypes = Types;
export const BootstrapActions = Creators;

export const bootstrapReducer = createReducer(initialState, {
    [Types.REQUEST]:defaultRequest,
    [Types.SUCCESS]:defaultSuccess,
    [Types.FAILURE]:defaultFailure,
});