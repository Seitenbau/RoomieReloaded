import { takeLatest, put, call, select, all } from "redux-saga/effects";
import { PlannerItemsActions, PlannerItemsTypes } from '../reducers/plannerItemsReducer';
import { getPlannerGroups } from '../selectors/plannerItemSelectors';
import { IHasDateRange, IPlannerGroup, IPlannerItem } from '../components/planner/base/plannerTypes';
import { setUsersLoadingState } from './plannerGroupSaga';
import { getCurrentCalendar, getCurrentDateTime } from "../selectors/calendarSelectors";
import { DateRangeServiceFactory } from "../services/dateRangeService/dateRangeServiceFactory";
import { IDataService, DataService, abortRequests } from "../services/plannerData/dataService";

const dateRangeServiceFactory = new DateRangeServiceFactory();
const plannerDataService: IDataService = new DataService();

export function* plannerItemsSaga() {
    yield takeLatest(PlannerItemsTypes.REQUEST, loadPlannerItems);
}

export function* loadPlannerItems() {
    yield call(setUsersLoadingState, true);
    try {
        const currentCalendar = yield select(getCurrentCalendar);
        const currentDateTime = yield select(getCurrentDateTime);

        const dateRangeService = dateRangeServiceFactory.create(currentCalendar);
        const currentDateRange = dateRangeService.calculateDateRange(currentDateTime);

        const groups: IPlannerGroup[] = yield select(getPlannerGroups);

        abortRequests();
        const groupPromises = groups.map(group => getRecords(currentDateRange, group));
        const groupRecords : IPlannerItem[][] = yield all(groupPromises);

        const allPlannerItems : IPlannerItem[] = [];
        groupRecords.forEach(plannerItems => allPlannerItems.push(...plannerItems));

        yield put(PlannerItemsActions.updateItems(allPlannerItems));
        yield put(PlannerItemsActions.success());
    } catch (outerException) {
        console.log();
        yield put(PlannerItemsActions.failure());
    }
    yield setUsersLoadingState(false);
}

function getRecords(currentDateRange: IHasDateRange, group: IPlannerGroup) : Promise<IPlannerItem[]> {
    try {
        return plannerDataService.getRecords(currentDateRange, group);
    } catch (e) {
        console.log(e);
        const empty : IPlannerItem[] = [];
        return new Promise<IPlannerItem[]>( () => empty);
    }
}