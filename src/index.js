import React from "react";
import ReactDOM from "react-dom/client";

/*
note: 
as it seems the redux discussions (stackoverflow & github sites) mention we have option whether to use 
createStore or createSlice (new redux toolkit as another option for redux),
i stick with createStore as of now, but if in your team already use createSlice, it will be a quick time to adapt with it
*/
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./reducers/index";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

// -- note: uncomment if want to log in console everytime store changed
// store.subscribe(() => {
//   console.log("redux store changed", store.getState());
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
