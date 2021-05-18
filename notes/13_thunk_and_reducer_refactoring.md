# 13 thunk and reducer refactoring

## log

- 유틸 함수를 작성하여 thunk 함수와 reducer 속에서 반복되는 코드 리팩토링 작업 진행
- AsyncActionCreator => AsyncActionCreatorBuilder로 변경됨
- AnyAsyncActionCreator: createAction으로 만들어지는 결과물의 any 타입, AnyPromiseCreator: 파리미터가 무엇이 들어오든 Promise를 반환하는 함수 => 2개의 type alias로 이후에 만들 리팩토링 함수의 파라미터 타입을 제한할 수 있다.

```ts
type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
type AnyPromiseCreator = (...params: any[]) => Promise<any>;
```

- reducer 1차 리팩토링

```ts
const github = createReducer<GithubState, GithubAction>(initialState, {
  [GET_USER_PROFILE]: (state) => ({
    ...state,
    userProfile: asyncState.load(),
  }),
  [GET_USER_PROFILE_SUCCESS]: (state, action) => ({
    ...state,
    userProfile: asyncState.success(action.payload),
  }),
  [GET_USER_PROFILE_ERROR]: (state, action) => ({
    ...state,
    userProfile: asyncState.error(action.payload),
  }),
});
```

## tips

- 특정 함수에 어떤 파라미터를 넣어야 하는지 미리 추출할 수 있다.

```ts
type Params = Parameters<F>;
```

- Promise를 생성하는 함수의 파라미터 값을 받아 thunk 함수를 리턴하는 함수를 작성, params의 값은 위에서 미리 추출한 Params type alias를 활용한다. thunk 함수 내부 코드는 리팩토링 전과 거의 동일

```ts
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
```

- 화살표 함수에서도 제네릭을 활용할 수 있다.

```ts
export type AsyncState<T, E = any> = {
  loading: boolean;
  data: T | null;
  error: E | null;
};

export const asyncState = {
  success: <T, E>(data: T): AsyncState<T, E> => ({
    data: data,
    loading: false,
    error: null,
  }),
};
```

- keyof: 객체의 key를 추출할 수 있는 키워드

```ts
const obj = {
  a: 1,
  b: 2,
  c: 3,
};

type keys = keyof typeof obj;
// type keys = "a" | "b" | "c"
```

- getType(): 파라미터로 액션 생성 함수를 넣었을 때 해당 액션의 타입을 추출해준다.

```ts
const [request, success, failure] = [
  asyncActionCreator.request,
  asyncActionCreator.success,
  asyncActionCreator.failure,
].map(getType);
```

- createReducer의 method chaining 방식에서 handleAction 함수의 파라미터에 들어갈 액션을 배열로 넣어주면 배열에 존재하는 액션들에 대해서 한번에 처리가 가능하다. 매번 배열에 액션의 종류를 나열할 수도 있지만 액션의 종류가 담긴 배열을 반환해주는 함수를 만들어 이용할 수도 있다.

```ts
type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;
export function transformToArray<AC extends AnyAsyncActionCreator>(
  asyncActionCreator: AC
) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}
```

## issue

- 어렵다. 리팩토링 하면서 갑자기 훅 난이도가 올라간 느낌이다. 🤯

## dependency
