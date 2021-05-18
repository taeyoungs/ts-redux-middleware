# 10 redux thunk

## log

- typesafe-actions: createStandardAction was renamed to createAction

- Reducer 작성 흐름

1. reducer에서 사용될 액션 정의
2. State, Action 타입 정의
3. Thunk 함수 작성
4. createReducer 유틸 함수를 이용한 reducer 작성

## tips

- axios method 뒤에 Generic을 설정해주면 response data의 타입을 설정할 수 있다.

```ts
const response = await axios.get<GithubProfile>(
  `https://api.github.com/users/${username}`
);
```

- typesafe-actions에는 비동기 작업에 관한 액션들을 선언할 때 이를 쉽게 작성할 수 있도록 도와주는 유틸 함수가 존재한다.

```ts
import { AxiosError } from 'axios';
import { createAsyncAction } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';

// 요청 시작, 성공, 실패에 대한 액션
export const GET_USER_PROFILE = 'github/GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'github/GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_ERROR = 'github/GET_USER_PROFILE_ERROR';

export const getUserProfileAsync = createAsyncAction(
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_ERROR
)<string, GithubProfile, AxiosError>();
```

## issue

- none

## dependency

- redux
- react-redux
- redux-thunk
- axios
- typesafe-actions

# 11 presentional component

## log

- 이름을 통해 Github 사용자 정보를 조회하는 GithubUsernameForm과 API 요청을 통해 받아온 사용자 정보를 바탕으로 렌더링하는 GithubProfileInfo 컴포넌트 작성

## tips

## issue

- none

## dependency

# 11 presentional component

## log

- useSelector를 통해 가져온 리덕스 상태 비구조화 할당

```ts
const { data, loading, error } = useSelector(
  (state: RootState) => state.github.userProfile
);
```

- thunk 함수를 dispatch하는 onSubmitUsername 함수 작성

```ts
const onSubmitUsername = (username: string) => {
  dispatch(getUserProfileThunk(username));
};
```

## tips

## issue

- none

## dependency

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

# 14 redux saga

## log

- saga 함수에서 사용할 액션의 타입을 정의하기 위해서 액션의 반환 타입(ReturnType)을 이용할 수 있다.

```ts
function* getUserProfileSaga(
  action: ReturnType<typeof getUserProfileAsync.request>
) {}
```

- takeEvery 함수를 이용하여 GET_USER_PROFILE 액션이 발생하는 것을 모니터링하고 액션이 들어올 경우 만들어놓은 saga 함수를 호출한다.

```ts
export function* githubSaga() {
  yield takeEvery(GET_USER_PROFILE, getUserProfileSaga);
}
```

- github 사용자를 조회하는 컴포넌트에서 기존에 thunk 함수를 생성하는 함수를 액션 객체로 보내던 것 대신 순수한 액션 객체를 디스패치로 보내 saga 함수를 실행시킨다.

```ts
const onSubmitUsername = (username: string) => {
  // thunk
  // dispatch(getUserProfileThunk(username));

  // saga
  dispatch(getUserProfileAsync.request(username));
};
```

## tips

- call: 특정 함수를 호출하고 결과물이 반환될 때까지 기다리는 함수
- put: 특정 액션을 디스패치 하는 함수
- takeEvery: 특정 액션을 모니터링하고 있다가 해당 액션이 들어올 경우 saga 함수를 호출하는 함수

## issue

- yield call 함수로 반환되는 결과물의 타입이 깨지는 현상이 존재하기 때문에 결과물을 저장할 변수에 직접 타입을 정의해줘야 한다.

```ts
const userProfile: GithubProfile = yield call(getUserProfile, action.payload);
```

## dependency

- redux-saga

# 15 saga refactoring

## log

- AsyncActionCreatorBuilder 함수의 제네릭에 맞춰서 타입을 상세히 정의한다. request, success, failure 순으로
- promise 생성 함수의 파라미터로 액션 객체에 담겨오는 username이 들어가기 때문에 RequestPayload를 파라미터 타입으로 설정하고 요청이 성공했을 때 반환되는 값이 결국 SuccessPayload가 되므로 SuccessPayload를 Promise의 반환 타입으로 설정한다.

```ts
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
) {}
```

## tips

- 파라미터가 있을 때와 없을 때의 상황을 모두 고려하여 Promise를 반환하는 Type alias 정의

```ts
type PromiseCreatorFunction<P, T> =
  | ((payload: P) => Promise<T>)
  | (() => Promise<T>);
```

- Promise 생성 함수에 파라미터가 있을 수도 있고 없을 수도 있어서 PromiseCreatorFunction에서 파리미터가 있는 경우와 없는 경우를 분리해놨었는데 이 처리로 인해 action.payload가 존재하는지 타입스크립트가 보장받을 수 없는 상황이 됐다. 따라서, 이러한 상황을 해결해주기 위하여 Type Guard를 작성한다.

```ts
// 타입 가드 사용 전
const result: SuccessPayload = yield call(promiseCreator, action.payload);

// 타입 가드 사용 후
// action.payload가 undefined가 아니라면 action은 payload값을 가지고 있다. 라는 Type Guard
function isPayloadAction(action: any): action is PayloadAction<string, any> {
  return action.payload !== undefined;
}

const result: SuccessPayload = isPayloadAction(action)
  ? yield call(promiseCreator, action.payload)
  : yield call(promiseCreator);
```

## issue

- none

## dependency
