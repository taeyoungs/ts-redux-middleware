import { Dispatch } from 'redux';
import { AsyncActionCreatorBuilder } from 'typesafe-actions';

type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
type AnyPromiseCreator = (...params: any[]) => Promise<any>;

// Generic을 사용하면 어떤 타입이든 올 수 있지만 extends로 확장한 해당 타입들을
// 만족하는 경우에만 사용할 수 있게 할 수 있다.
export default function createAsyncThunk<
  A extends AnyAsyncActionCreator,
  F extends AnyPromiseCreator
>(asyncActionCreator: A, promiseCreator: F) {
  // F라는 함수에 어떤 파라미터를 넣어야 하는지 추출
  type Params = Parameters<F>;

  return function thunk(...params: Params) {
    return async (dispatch: Dispatch) => {
      // AnyAsyncActionCreator를 extends 했기 때문에 AsyncActionCreatorBuilder로 만들어지는 결과물이 갖는
      // 메소드들을 갖고 있다.
      const { request, failure, success } = asyncActionCreator;
      dispatch(request(null));
      try {
        const result = await promiseCreator(...params);
        dispatch(success(result));
      } catch (error) {
        dispatch(failure(error));
      }
    };
  };
}
