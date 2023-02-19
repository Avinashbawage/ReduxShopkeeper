import { legacy_createStore as createStore, applyMiddleware } from "redux";
import Bookbuy from "./reducers";
import thunk from "redux-thunk";

const store = createStore(Bookbuy, applyMiddleware(thunk));

export default store;
