import { push } from "react-router-redux";
import { takeLatest, put, select, call } from "redux-saga/effects";
import { CalendarTypes, CalendarType, CalendarActions } from "../reducers/calendarReducer";
import { getCurrentCalendar, getCurrentDateTime } from "../selectors/calendarSelectors";
import {Moment } from 'moment';
import { createTimeFrameTextGenerator } from "../services/timeframeText/timeFrameTextGeneratorFactory";
import { PlannerItemsActions } from "../reducers/plannerItemsReducer";
import { setUsersLoadingState } from "./plannerGroupSaga";

export function* calendarSaga(){
    yield takeLatest(CalendarTypes.SET_CURRENT_CALENDAR, setCalendar);
    yield takeLatest(CalendarTypes.SET_CURRENT_DATE_TIME, setCurrentDateTime);
}

function* setCalendar(){    
    const calendar:CalendarType = yield select(getCurrentCalendar);
    const currentDateTime:Moment = yield select(getCurrentDateTime);
    const target = calendar.toString().toLowerCase();
    
    yield call(() => push(`/${target}`));
    yield updateCurrentData(calendar, currentDateTime);
}

function* setCurrentDateTime(){
    const calendar:CalendarType = yield select(getCurrentCalendar);
    const currentDateTime:Moment = yield select(getCurrentDateTime);
    
    yield updateCurrentData(calendar, currentDateTime);
}

function* updateCurrentData(calendar:CalendarType, currentDateTime:Moment)
{
    const timeFrameTextGenerator = createTimeFrameTextGenerator(calendar);
    const newTimeFrameText = timeFrameTextGenerator.getTimeFrameText(currentDateTime);
    yield put(CalendarActions.setCurrentTimeframeText(newTimeFrameText));

    yield put(PlannerItemsActions.request());
}