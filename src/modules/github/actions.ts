// Thunk 함수에서 디스패치할 3가지 액션 작성

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
