import { combineReducers } from "redux";

import GlobalReducer from "./GlobalReducer";

// -- note:  if there are multiple reducers, combine all here
const reducerList = combineReducers({
  GlobalReducer,
});

export default reducerList;
