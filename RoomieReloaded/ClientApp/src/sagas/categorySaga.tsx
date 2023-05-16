import { takeLatest, select, call } from "redux-saga/effects";
import { getCategoryStates } from "../selectors/categorySelectors";
import { CategoryTypes, ICategoryState, CategoryStateCookieName } from "../reducers/categoryReducer";
import { CookieServiceFactory } from "../services/cookies/cookieService";

const cookieService = new CookieServiceFactory().create();

export function* categorySaga(){
    yield takeLatest(CategoryTypes.SET_CATEGORY_STATE, setCategoryState);
}

function* setCategoryState(){
    const currentCategories:ICategoryState[] = yield select(getCategoryStates);
    yield call( () => cookieService.setCookieValue(CategoryStateCookieName, currentCategories) );
}