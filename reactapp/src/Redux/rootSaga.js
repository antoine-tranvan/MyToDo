import { takeLatest } from "redux-saga/effects";
import { handleGetTasks } from "./Tasks/getTasks.handler";
import { GET_TASKS } from "./Tasks/getTasks.reducer";

export function* watcherSaga() {
  yield takeLatest(GET_TASKS, handleGetTasks);
}
