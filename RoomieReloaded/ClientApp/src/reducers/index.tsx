import { combineReducers } from 'redux';
import { calendarReducer, CalendarState } from './calendarReducer';
import { plannerItemsReducer, PlannerItemsState } from './plannerItemsReducer';
import { plannerGroupReducer, PlannerGroupState } from './plannerGroupReducer';
import { bootstrapReducer, BootstrapState } from './bootstrapReducer';

export const rootReducer = combineReducers({
  bootstrap: bootstrapReducer,
  calendar: calendarReducer,
  plannerItems: plannerItemsReducer,
  plannerGroups: plannerGroupReducer
});

interface ILocalState {
  bootstrap: BootstrapState,
  calendar: CalendarState;
  plannerItems: PlannerItemsState;
  plannerGroups: PlannerGroupState;
}

export type RootState = Readonly<ILocalState>;

export interface ISauceTypes<T, U> {
  Types: T;
  Creators: U;
}
