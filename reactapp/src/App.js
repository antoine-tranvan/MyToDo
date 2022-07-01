import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";

import Landing from "./Screens/Landing";
import HomeA from "./Screens/HomeA.js";
import HomeB from "./Screens/HomeB.js";

import username from "./reducers/user.reducer";
import token from "./reducers/token.reducer";
import language from "./reducers/language.reducer";
import idList from "./reducers/idList.reducer";
import indexMenu from "./reducers/indexMenu.reducer";
import rawLists from "./reducers/rawLists.reducer";
import trigger from "./reducers/trigger.reducer";
import setTasks from "./Redux/Tasks/getTasks.reducer";
import { watcherSaga } from "./Redux/rootSaga";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    token,
    username,
    language,
    idList,
    indexMenu,
    rawLists,
    trigger,
    setTasks,
  }),
  {},
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(watcherSaga);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/homeA" component={HomeA} />
          <Route path="/homeB" component={HomeB} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
