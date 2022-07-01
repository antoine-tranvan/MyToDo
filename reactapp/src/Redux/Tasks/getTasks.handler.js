import { call, put, select } from "redux-saga/effects";
import { requestGetTasks } from "./getTasks.request";
import { setTasks } from "./getTasks.reducer";
import { connect } from "react-redux";

export function* handleGetTasks(props) {
  try {
    const token = yield select((state) => state.token);
    const idList = yield select((state) => state.idList);
    console.log("idList", idList);
    const response = yield call(() => requestGetTasks(token, idList));
    var { data } = response;
    console.log("data", data);
    yield put(setTasks(data));
  } catch (error) {
    console.log(error);
  }
}
