import { takeLatest, call, put, takeEvery, delay } from "redux-saga/effects";
import ALL_CONSTANTS from "../Constants/Constants";
import * as RestService from "../../Services/RestService";

// Saga Workers

function* getUsersWorker() {
  try {
    yield put({
      type: ALL_CONSTANTS.GET_USERS,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
    });
    const response = yield call(() => RestService.getUsers());
    yield put({
      type: ALL_CONSTANTS.GET_USERS,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.GET_USERS,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
    });
  }
}

function* getReactionsWorker(params) {
  try {
    yield put({
      type: ALL_CONSTANTS.GET_REACTIONS,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
    });
    const response = yield call(() => RestService.getReactions());
    yield put({
      type: ALL_CONSTANTS.GET_REACTIONS,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.GET_REACTIONS,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
    });
  } finally {
    // call the Contents fetching part after getting result of the
    // reactions as we have logic dependent on the reactions
    // calling it in finally will work only either success or failed part
    params.callback();
  }
}

function* getContentsWorker(params) {
  try {
    yield put({
      type: ALL_CONSTANTS.GET_CONTENTS,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
    });
    const response = yield call(() => RestService.getContents());
    yield put({
      type: ALL_CONSTANTS.GET_CONTENTS,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
    });

    // Start fetching the content reactions details after getting the basic contents details
    params.callback(response);
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.GET_CONTENTS,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
    });
  }
}

function* getContentsByIdWorker(params) {
  try {
    yield put({
      type: ALL_CONSTANTS.GET_CONTENT_BY_ID,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
      params: params.params,
    });
    const response = yield call(() =>
      RestService.getContentById(params.params)
    );

    // params are passed to update the corresponding store
    yield put({
      type: ALL_CONSTANTS.GET_CONTENT_BY_ID,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
      params: params.params,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.GET_CONTENT_BY_ID,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
    });
  }
}

function* updateReactionWorker(params) {
  try {
    // when there are multiple clicks are calls made making adelay so that saga can cancel all the previously called workers
    // as we are using takeLates instead of takeEvery
    yield delay(500);
    yield put({
      type: ALL_CONSTANTS.UPDATE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
      params: params.params,
    });
    const response = yield call(() =>
      RestService.updateReaction(params.params)
    );
    yield put({
      type: ALL_CONSTANTS.UPDATE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
      params: params.params,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.UPDATE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
      params: params.params,
    });
  }
}

function* deleteReactionWorker(params) {
  try {
    // when there are multiple clicks are calls made making adelay so that saga can cancel all the previously called workers
    // as we are using takeLates instead of takeEvery
    yield delay(500);
    yield put({
      type: ALL_CONSTANTS.DELETE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isPending: true,
      params: params.params,
    });
    const response = yield call(() =>
      RestService.deleteReaction(params.params)
    );
    yield put({
      type: ALL_CONSTANTS.DELETE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      payload: response,
      params: params.params,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.DELETE_REACTION,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
      params: params.params,
    });
  }
}

function* onUserChangeWorker(params) {
  try {
    yield put({
      type: ALL_CONSTANTS.UPDATE_SELECTED_USER,
      ...ALL_CONSTANTS.commonInitialState,
      isSuccess: true,
      params: params.params,
    });
  } catch (err) {
    yield put({
      type: ALL_CONSTANTS.UPDATE_SELECTED_USER,
      ...ALL_CONSTANTS.commonInitialState,
      isFailed: true,
      payload: err,
    });
  }
}

// Saga Watchers
export function* getUsers() {
  yield takeLatest(ALL_CONSTANTS.GET_USERS_SAGA, getUsersWorker);
}

export function* getReactions() {
  yield takeLatest(ALL_CONSTANTS.GET_REACTIONS_SAGA, getReactionsWorker);
}

export function* getContents() {
  yield takeLatest(ALL_CONSTANTS.GET_CONTENTS_SAGA, getContentsWorker);
}

export function* getContentById() {
  yield takeEvery(ALL_CONSTANTS.GET_CONTENT_BY_ID_SAGA, getContentsByIdWorker);
}

export function* updateReaction() {
  yield takeLatest(ALL_CONSTANTS.UPDATE_REACTION_SAGA, updateReactionWorker);
}

export function* deleteReaction() {
  yield takeLatest(ALL_CONSTANTS.DELETE_REACTION_SAGA, deleteReactionWorker);
}

export function* onUserChange() {
  yield takeEvery(ALL_CONSTANTS.UPDATE_SELECTED_USER_SAGA, onUserChangeWorker);
}
