# 10 redux thunk

## log

- typesafe-actions: createStandardAction was renamed to createAction

- Reducer 작성 흐름

1. reducer에서 사용될 액션 정의
2. State, Action 타입 정의
3. Thunk 함수 작성
4. createReducer 유틸 함수를 이용한 reducer 작성

- 비동기 작업을 위한 Thunk 함수에는 총 3가지의 액션이 필요

1. 요청 중이라는 로딩 상태를 알리는 액션
2. 요청이 성공했을 때의 액션
3. 요청이 실패했을 때의 액션

## tips

- API의 결과물을 위한 타입을 미리 정의해두면 유용하게 사용할 수 있다.
- axios method 뒤에 Generic을 설정해주면 response data의 타입을 설정할 수 있다.

```ts
const response = await axios.get<GithubProfile>(
  `https://api.github.com/users/${username}`
);
```

- typesafe-actions에는 비동기 작업에 관한 액션들을 선언할 때 이를 쉽게 작성할 수 있도록 도와주는 유틸 함수가 존재한다. createAction으로 각 액션마다 액션 생성 함수를 작성할 수도 있지만 createAsyncAction으로 request, success, failure, cancel 함수를 한꺼번에 작성할 수도 있다.

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
