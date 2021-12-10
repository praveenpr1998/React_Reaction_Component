import { spawn, all, call } from "redux-saga/effects";
import * as SagaActions from "./Actions/index";
const sagas = Object.values(SagaActions);

export default function* rootSaga() {
  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}
