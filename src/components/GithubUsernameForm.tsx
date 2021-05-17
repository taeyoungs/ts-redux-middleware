import React, { useState } from 'react';
import './githubUsernameForm.css';

interface IGithubUsernameFormProps {
  onSubmitUsername: (username: string) => void;
}

function GithubUsernameForm({ onSubmitUsername }: IGithubUsernameFormProps) {
  const [input, setInput] = useState('');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmitUsername(input);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="GithubUsernameForm">
      <input
        value={input}
        onChange={onChange}
        placeholder="Github 계정명을 입력하세요."
      />
      <button type="submit">조회</button>
    </form>
  );
}

export default GithubUsernameForm;
