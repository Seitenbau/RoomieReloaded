import { takeLatest, put, call, select } from "redux-saga/effects";
import { NavigationTypes } from '../reducers/navigationReducer';
import { getCurrentCalendar } from '../selectors/calendarSelectors';
import moment from 'moment';
import { CalendarActions } from "../reducers/calendarReducer";
import { NavigationService } from "../services/navigation/navigationService";
import { RootState } from "../reducers";
import { createNavigationService } from "../services/navigation/navigationServiceFactory";
import { store } from "..";
import { CalendarType } from "../utility/dateTimeHelper";

export function* navigationSaga(){
    yield takeLatest(NavigationTypes.ON_MONTH_CLICK, () => navigateCalendar('MONTH'));
    yield takeLatest(NavigationTypes.ON_WEEK_CLICK, () => navigateCalendar('WEEK'));
    yield takeLatest(NavigationTypes.ON_DAY_CLICK, () => navigateCalendar('DAY'));
    yield takeLatest(NavigationTypes.ON_NEXT_TIME_FRAME_CLICK, () => navigate(navigateNext));
    yield takeLatest(NavigationTypes.ON_PREVIOUS_TIME_FRAME_CLICK, () => navigate(navigatePrevious));
    yield takeLatest(NavigationTypes.ON_TODAY_CLICK, () => navigateToDate(moment()));
    yield takeLatest(NavigationTypes.ON_TIME_FRAME_SELECTED,  ({value}:any) => navigateToDate(value) );
}

function* navigateCalendar(calendar:CalendarType){
    console.log(calendar)
    yield put(CalendarActions.setCurrentCalendar(calendar));
}

function* navigate(navigationFunc: (navigationService:NavigationService, state:RootState) => moment.Moment){
    const calendarType:CalendarType = yield select(getCurrentCalendar);
    
    const navigationService = yield call( createNavigationService, calendarType );

    const state = yield call ( store.getState );
    
    const result = yield call ( navigationFunc, navigationService, state );

    yield navigateToDate(result);
}

function* navigateToDate(date:moment.Moment) {
    yield put(CalendarActions.setCurrentDateTime(date));
}

function navigateNext(navigationService:NavigationService, state:RootState):moment.Moment{
    return navigationService.navigateNext(state);
}

function navigatePrevious(navigationService:NavigationService, state:RootState):moment.Moment{
    return navigationService.navigatePrevious(state);
}