import { Action } from 'redux';
import { createActions, createReducer } from 'reduxsauce';
import { ISauceTypes } from '.';
import moment from 'moment';
import { CalendarType } from '../utility/dateTimeHelper';

const { Types, Creators }: ISauceTypes<ILocalTypes, ILocalCreators> = createActions(
  {
    setCurrentCalendar: ['value'],
    setCurrentDateTime: ['value'],
    setCurrentTimeframeText: ['value'],
  },
  {
    prefix: 'CALENDAR_',
  },
);

interface ILocalTypes {
  SET_CURRENT_CALENDAR: string;
  SET_CURRENT_DATE_TIME: string;
  SET_CURRENT_TIMEFRAME_TEXT: string;
}

interface ILocalCreators {
  setCurrentCalendar: (value?: any) => Action<any>;
  setCurrentDateTime: (value?: any) => Action<any>;
  setCurrentTimeframeText: (value?: any) => Action<any>;
}

interface ILocalState {
  currentCalendar: CalendarType;
  currentDateTime: moment.Moment;
  currentTimeframeText: string;
}

const initialState: ILocalState = {
  currentCalendar: 'WEEK',
  currentDateTime: moment(),
  currentTimeframeText: '',
};

export const CalendarTypes = Types;
export const CalendarActions = Creators;

export type CalendarState = Readonly<ILocalState>;

const setCalendar = (state: CalendarState, { value }: any) => ({ ...state, currentCalendar: value });
const setDateTime = (state: CalendarState, { value }: any) => ({ ...state, currentDateTime: value });
const setTimeframeText = (state: CalendarState, { value }: any) => ({ ...state, currentTimeframeText: value });

export const calendarReducer = createReducer(initialState, {
  [Types.SET_CURRENT_CALENDAR]: setCalendar,
  [Types.SET_CURRENT_DATE_TIME]: setDateTime,
  [Types.SET_CURRENT_TIMEFRAME_TEXT]: setTimeframeText,
});
