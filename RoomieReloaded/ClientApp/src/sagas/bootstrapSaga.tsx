import { put, takeEvery, call } from "redux-saga/effects";
import { BootstrapTypes, BootstrapActions } from '../reducers/bootstrapReducer';
import { loadPlannerGroups } from "./plannerGroupSaga";
import { loadPlannerItems } from "./plannerItemsSaga";
import { CalendarActions } from "../reducers/calendarReducer";
import moment from "moment";
import { CookieServiceFactory } from "../services/cookies/cookieService";
import { CategoryStateCookieName, CategoryActions } from "../reducers/categoryReducer";
import { ParameterService } from "../services/parameter/parameterService";

const cookieService = new CookieServiceFactory().create();
const parameterService = new ParameterService();

export function* bootstrapSaga(){
    yield takeEvery(BootstrapTypes.REQUEST, initialize);
}

function* initialize()
{
    console.log("loading planner data")
    try
    {
        const currentCalendar = parameterService.getCalendar() || 'DAY';
        yield put(CalendarActions.setCurrentCalendar(currentCalendar));

        const currentDateTime = parameterService.getDate() || moment();
        yield put(CalendarActions.setCurrentDateTime(currentDateTime));
        yield loadPlannerData();

        yield put(BootstrapActions.success());

        const categoryStates = yield call(() => cookieService.getCookieValue(CategoryStateCookieName));
        
        if(categoryStates){
            yield put(CategoryActions.overwriteCategoryStates( categoryStates ));
        }        
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
