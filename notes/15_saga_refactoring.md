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
