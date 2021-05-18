# 12 container component

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
