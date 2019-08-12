import { takeLatest, put, call, select } from "redux-saga/effects";
import { PlannerGroupTypes, PlannerGroupActions } from '../reducers/plannerGroupReducer';
import { IDataService, DataService } from '../services/plannerData/dataService';
import { getPlannerGroups } from '../selectors/plannerItemSelectors';
import { IPlannerGroup } from '../components/planner/base/plannerTypes';

const plannerDataService:IDataService = new DataService();

export function* plannerGroupsSaga(){
    yield takeLatest(PlannerGroupTypes.REQUEST, loadPlannerGroups)
}

export function* loadPlannerGroups(){
    try{
        const plannerGroups = yield call( plannerDataService.getGroups );

        yield put(PlannerGroupActions.updateGroups(plannerGroups));

        yield put(PlannerGroupActions.success());
    }catch(e){
        console.log(e);
        yield put(PlannerGroupActions.failure());
    }    
}

export function* setUsersLoadingState(isLoading:boolean)
{
    const plannerGroups : IPlannerGroup[] = yield select(getPlannerGroups);

    const groupIds = plannerGroups.map(group => group.id);

    yield put(PlannerGroupActions.setGroupsLoading({
        groupIds:groupIds,
        isLoading:isLoading
    }));
}