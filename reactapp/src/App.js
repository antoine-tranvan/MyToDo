import logo from "./logo.svg";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import Landing from "./Screens/Landing";
import Home from "./Screens/Home.js";

import username from "./reducers/user.reducer";
import token from "./reducers/token.reducer";
import language from "./reducers/language.reducer";

const store = createStore(combineReducers({ token, username, language }));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
