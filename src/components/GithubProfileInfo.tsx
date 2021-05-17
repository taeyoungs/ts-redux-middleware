import React from 'react';
import './GithubProfileInfo.css';

interface IGithubProfileInfoProps {
  name: string;
  thumbnail: string;
  bio: string;
  blog: string;
}

function GithubProfileInfo({
  bio,
  blog,
  name,
  thumbnail,
}: IGithubProfileInfoProps) {
  return (
    <div className="GithubProfileInfo">
      <div className="profile-head">
        <img src={thumbnail} alt="thumbnail" />
        <div>{name}</div>
      </div>
      <p>{bio}</p>
      {blog && <a href={blog}>블로그</a>}
    </div>
  );
}

export default GithubProfileInfo;
