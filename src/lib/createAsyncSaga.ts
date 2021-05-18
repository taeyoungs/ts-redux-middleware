import { AsyncActionCreatorBuilder, PayloadAction } from 'typesafe-actions';
import { call, put } from 'redux-saga/effects';

// P: promiseCreator를 호출할 때 파라미터를 의미
// T: promiseCreator에서 만들어지는 Promise의 반환 타입
// 다음과 같이 작성하는 이유는 파라미터가 있을 때와 없을 때 모두 동작하게 하기 위하여
type PromiseCreatorFunction<P, T> =
  | ((payload: P) => Promise<T>)
  | (() => Promise<T>);

// action.payload가 undefined가 아니라면 action은 payload값을 가지고 있다. 라는 Type Guard
function isPayloadAction(action: any): action is PayloadAction<string, any> {
  return action.payload !== undefined;
}

export default function createAsyncSaga<
  RequestType,
  RequestPayload,
  SuccessType,
  SuccessPayload,
  FailureType,
  FailurePayload
>(
  asyncActionCreator: AsyncActionCreatorBuilder<
    [RequestType, [RequestPayload, undefined]],
    [SuccessType, [SuccessPayload, undefined]],
    [FailureType, [FailurePayload, undefined]]
  >,
  promiseCreator: PromiseCreatorFunction<RequestPayload, SuccessPayload>
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    try {
      const result: SuccessPayload = isPayloadAction(action)
        ? yield call(promiseCreator, action.payload)
        : yield call(promiseCreator);
      yield put(asyncActionCreator.success(result));
    } catch (error) {
      yield put(asyncActionCreator.failure(error));
    }
  };
}
