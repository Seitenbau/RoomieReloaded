import { fork, all } from 'redux-saga/effects';
import { calendarSaga } from './calendarSaga';
import { bootstrapSaga } from './bootstrapSaga';
import { plannerGroupsSaga } from './plannerGroupSaga';
import { plannerItemsSaga } from './plannerItemsSaga';
import { navigationSaga } from './navigationSaga';
import { categorySaga } from './categorySaga';

export default function* root() {
  yield all([
    fork(bootstrapSaga),
    fork(calendarSaga),
    fork(navigationSaga),
    fork(plannerGroupsSaga),
    fork(plannerItemsSaga),
    fork(categorySaga)
  ]);
}
