import { put, takeEvery, call } from "redux-saga/effects";
import { BootstrapTypes, BootstrapActions } from '../reducers/bootstrapReducer';
import { loadPlannerGroups } from "./plannerGroupSaga";
import { loadPlannerItems } from "./plannerItemsSaga";
import { CalendarActions } from "../reducers/calendarReducer";
import moment from "moment";

export function* bootstrapSaga(){
    yield takeEvery(BootstrapTypes.REQUEST, initialize);
}

function* initialize()
{
    console.log("loading planner data")
    try
    {
        yield put(CalendarActions.setCurrentDateTime(moment()));
        yield put(CalendarActions.setCurrentCalendar('DAY'));
        yield loadPlannerData();

        yield put(BootstrapActions.success());
    }
    catch(e){
        console.log(e)
        yield put(BootstrapActions.failure());
    }
}

function* loadPlannerData()
{    
    yield call(loadPlannerGroups);
    yield call(loadPlannerItems);
}
