import { RootState } from '../reducers';

export const getCurrentCalendar = (state: RootState) => state.calendar.currentCalendar;
export const getCurrentDateTime = (state: RootState) => state.calendar.currentDateTime;
export const getCurrentTimeFrameText = (state: RootState) => state.calendar.currentTimeframeText;
