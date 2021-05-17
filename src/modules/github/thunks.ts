import { Dispatch } from 'redux';
import { getUserProfile } from '../../api/github';
import { getUserProfileAsync } from './actions';

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
