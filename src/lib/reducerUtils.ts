import {
  ActionType,
  AsyncActionCreatorBuilder,
  getType,
} from 'typesafe-actions';

// 기본값을 any로 설정해주면 후에 해당 타입을 사용할 때 any로 설정한 제네릭은 생략해도 된다.
export type AsyncState<T, E = any> = {
  loading: boolean;
  data: T | null;
  error: E | null;
};

// initial, load, success, error 상태를 처리하는 함수를 작성
export const asyncState = {
  initial: <T, E>(initialData?: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData || null,
    error: null,
  }),
  load: <T, E>(data?: T): AsyncState<T, E> => ({
    loading: true,
    data: data || null,
    error: null,
  }),
  success: <T, E>(data: T): AsyncState<T, E> => ({
    data: data,
    loading: false,
    error: null,
  }),
  error: <T, E>(error: E): AsyncState<T, E> => ({
    error,
    loading: true,
    data: null,
  }),
};

type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
export function transformToArray<AC extends AnyAsyncActionCreator>(
  asyncActionCreator: AC
) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}

// keyof: 객체의 key를 추출할 수 있는 키워드
export function createAsyncReducer<
  AC extends AnyAsyncActionCreator,
  K extends keyof S,
  S
>(asyncActionCreator: AC, key: K) {
  return (state: S, action: ActionType<AC>) => {
    // getType(): 파라미터로 액션 생성 함수를 넣었을 때 해당 액션의 타입을 추출해준다.
    const [request, success, failure] =
      transformToArray(asyncActionCreator).map(getType);

    switch (action.type) {
      case request:
        return {
          ...state,
          [key]: asyncState.load(),
        };
      case success:
        return {
          ...state,
          [key]: asyncState.success(action.payload),
        };
      case failure:
        return {
          ...state,
          [key]: asyncState.error(action.payload),
        };
      default:
        return state;
    }
  };
}
