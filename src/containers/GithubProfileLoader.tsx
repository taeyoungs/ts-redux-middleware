import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GithubProfileInfo from '../components/GithubProfileInfo';
import GithubUsernameForm from '../components/GithubUsernameForm';
import { RootState } from '../modules';
import { getUserProfileThunk } from '../modules/github';

function GithubProfileLoader() {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.github.userProfile
  );
  const dispatch = useDispatch();

  const onSubmitUsername = (username: string) => {
    dispatch(getUserProfileThunk(username));
  };

  return (
    <>
      <GithubUsernameForm onSubmitUsername={onSubmitUsername} />
      {loading && <p style={{ textAlign: 'center' }}>로딩 중입니다...</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && (
        <GithubProfileInfo
          bio={data.bio}
          blog={data.blog}
          thumbnail={data.avatar_url}
          name={data.name}
        />
      )}
    </>
  );
}

export default GithubProfileLoader;
