import { getCoreSDK } from '@looker/extension-sdk-react'
import { all, call, put, takeEvery, select } from 'redux-saga/effects'
import { Actions, allLooksSuccess, runLookSuccess, error, Action, State } from '.'

function* allLooksSaga() {
  const coreSDK = getCoreSDK()
  const result = yield call([
    coreSDK,
    coreSDK.all_looks,
  ])
  if (result.ok) {
    // Take up to the first 10 looks
    const looks = result.value.slice(0, 9)
    yield put(allLooksSuccess(looks))
  } else {
    yield put(error(result.error.message))
  }
}

function* runLookSaga(action: Action) {
  const lookId = action.payload as number
  const state: State = yield select()
  if (state.queries[lookId]) {
    // fast display if query run previously - fresh data will be displayed later
    yield put(runLookSuccess(lookId, state.queries[lookId]))
  }
  const coreSDK = getCoreSDK()
  const result = yield call([
    coreSDK,
    coreSDK.run_look,
  ], {look_id: lookId, result_format: 'json'})
  if (result.ok) {
    yield put(runLookSuccess(lookId, result.value))
  } else {
    yield put(error(result.error.message))
  }
}

export function* sagaCallbacks() {
  yield all([
    takeEvery(Actions.ALL_LOOKS_REQUEST, allLooksSaga),
    takeEvery(Actions.RUN_LOOK_REQUEST, runLookSaga),
  ])
}
