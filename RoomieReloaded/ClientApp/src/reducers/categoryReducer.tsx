import { Action } from 'redux';
import { createActions, createReducer } from 'reduxsauce';
import { ISauceTypes } from '.';

export const CategoryStateCookieName = "CategoryStates";

const { Types, Creators }: ISauceTypes<ILocalTypes, ILocalCreators> = createActions(
  {
    setCategoryState: ['category', 'value'],
    overwriteCategoryStates: ['newStates'],
  },
  {
    prefix: 'CATEGORY_',
  },
);

interface ILocalTypes {
  SET_CATEGORY_STATE: string;
  OVERWRITE_CATEGORY_STATES: string
}

interface ILocalCreators {
  setCategoryState: (category?: string, value?: boolean) => Action<any>;
  overwriteCategoryStates: (newStates: ICategoryState[]) => Action<any>;
}

interface ILocalState {
  categoryStates: ICategoryState[]
}

export interface ICategoryState{
    category: string,
    isCollapsed: boolean,
}

const initialState: ILocalState = {
    categoryStates: []
};

export const CategoryTypes = Types;
export const CategoryActions = Creators;

export type CategoryState = Readonly<ILocalState>;
export type CategoryCreators = Readonly<ILocalCreators>;

const setCategoryState = (state: CategoryState, { category, value }: any) => {
    const categoryStates = state.categoryStates.slice(0);
    const existingCategory = categoryStates.find(s => s.category === category);
    if(existingCategory){
        existingCategory.isCollapsed = value;
    }else{
        const newState : ICategoryState = {
            category: category,
            isCollapsed: value
        };
        categoryStates.push( newState );
    }

    return {
        ...state,
        categoryStates:categoryStates
    };
};

const overwriteCategoryStates = (state: CategoryState, {newStates}:any) => {
    return {
        ...state,
        categoryStates:newStates
    };
}

export const categoryReducer = createReducer(initialState, {
  [Types.SET_CATEGORY_STATE]: setCategoryState,
  [Types.OVERWRITE_CATEGORY_STATES]: overwriteCategoryStates,
});
