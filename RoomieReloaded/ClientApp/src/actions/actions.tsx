import {AnyAction} from "redux";

export type AnyValueCreator = (value?: any) => AnyAction;
export type VoidCreator = () => AnyAction;

/* Common State */
export interface IRequestState {
  fetching: boolean;
  error: boolean;
  success: boolean;
}

export const requestActions = {
  failure: null,
  request: ['value'],
  reset: null,
  success: ['value'],
};

export interface IRequestCreators {
  failure: VoidCreator;
  request: AnyValueCreator;
  reset: VoidCreator;
  success: AnyValueCreator;
}

export interface IRequestTypes {
  FAILURE: string;
  REQUEST: string;
  RESET: string;
  SUCCESS: string;
}

export const initialRequestState = {
  fetching: false,
  error: false,
  success: false,
};
/* Common Reducers */
export const defaultRequest = (state: IRequestState): IRequestState =>
  ({...state, error: false, fetching: true, success: false});
export const defaultFailure = (state: IRequestState): IRequestState =>
  ({...state, error: true, fetching: false, success: false});
export const defaultSuccess = (state: IRequestState): IRequestState =>
  ({...state, error: false, fetching: false, success: true});