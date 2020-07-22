import { combineReducers } from 'redux';
import { calendarReducer, CalendarState } from './calendarReducer';
import { plannerItemsReducer, PlannerItemsState } from './plannerItemsReducer';
import { plannerGroupReducer, PlannerGroupState } from './plannerGroupReducer';
import { bootstrapReducer, BootstrapState } from './bootstrapReducer';
import { categoryReducer, CategoryState}  from './categoryReducer';

export const rootReducer = combineReducers({
  bootstrap: bootstrapReducer,
  calendar: calendarReducer,
  plannerItems: plannerItemsReducer,
  plannerGroups: plannerGroupReducer,
  categories: categoryReducer
});

interface ILocalState {
  bootstrap: BootstrapState,
  calendar: CalendarState;
  plannerItems: PlannerItemsState;
  plannerGroups: PlannerGroupState;
  categories: CategoryState;
}

export type RootState = Readonly<ILocalState>;

export interface ISauceTypes<T, U> {
  Types: T;
  Creators: U;
}
