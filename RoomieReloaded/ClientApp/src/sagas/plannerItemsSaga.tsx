import { takeLatest, put, call, select } from "redux-saga/effects";
import { PlannerItemsActions, PlannerItemsTypes } from '../reducers/plannerItemsReducer';
import { getPlannerGroups } from '../selectors/plannerItemSelectors';
import { IPlannerGroup, IPlannerItem } from '../components/planner/base/plannerTypes';
import { setUsersLoadingState } from './plannerGroupSaga';
import { getCurrentCalendar, getCurrentDateTime } from "../selectors/calendarSelectors";
import { DateRangeServiceFactory } from "../services/dateRangeService/dateRangeServiceFactory";
import { IDataService, DataService } from "../services/plannerData/dataService";

const dateRangeServiceFactory = new DateRangeServiceFactory();
const plannerDataService:IDataService = new DataService();

export function* plannerItemsSaga(){
    yield takeLatest(PlannerItemsTypes.REQUEST, loadPlannerItems);
}

export function* loadPlannerItems()
{
    yield call(setUsersLoadingState, true);
    try{
        const currentCalendar = yield select(getCurrentCalendar);
        const currentDateTime = yield select(getCurrentDateTime);
    
        const dateRangeService = dateRangeServiceFactory.create(currentCalendar);
        const currentDateRange = dateRangeService.calculateDateRange(currentDateTime);
    
        const groups : IPlannerGroup[] = yield select(getPlannerGroups);

        console.log("groups", groups)
    
        let records : IPlannerItem[] = [];
        
        for (let index = 0; index < groups.length; index++) {
            const group = groups[index];
    
            const groupRecords : IPlannerItem[] = yield call(plannerDataService.getRecords, currentDateRange, group);
    
            records = records.concat(groupRecords);
        }
    
        yield put(PlannerItemsActions.updateItems(records));

        yield put(PlannerItemsActions.success());
    }catch(e){        
        console.log(e);
        yield put(PlannerItemsActions.failure());
    }

    yield setUsersLoadingState(false);
}