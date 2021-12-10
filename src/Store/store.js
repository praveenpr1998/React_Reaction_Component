import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../Saga/saga.js";
import reducer from "../Saga/Reducers/index";
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(reducer, {}, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);
