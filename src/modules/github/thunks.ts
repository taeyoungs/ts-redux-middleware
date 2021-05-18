import { getUserProfile } from '../../api/github';
import createAsyncThunk from '../../lib/createAsyncThunk';
import { getUserProfileAsync } from './actions';

/*
export function getUserProfileThunk(username: string) {
  return async (dispatch: Dispatch) => {
    const { failure, request, success } = getUserProfileAsync;

    dispatch(request(null));

    try {
      // 파라미터로 받아온 username을 가지고 api 요청
      const userProfile = await getUserProfile(username);
      // 요청이 성공적으로 이루어졌다면 success 액션
      dispatch(success(userProfile));
    } catch (error) {
      // 요청이 실패했을 경우 error 액션
      dispatch(failure(error));
    }
  };
}
*/

// 첫 번째 파라미터로는 Action을 생성하는 함수
// 두 번째 파라미터로는 API 요청 함수
export const getUserProfileThunk = createAsyncThunk(
  getUserProfileAsync,
  getUserProfile
);
