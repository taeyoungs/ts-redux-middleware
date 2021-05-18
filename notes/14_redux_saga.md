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
