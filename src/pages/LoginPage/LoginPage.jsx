import axios from 'axios';

import { useState, useContext } from 'react';
import { AuthContextStore } from '../../components/context/AuthContext';

const Login = () => {
  const value = useContext(AuthContextStore);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const option = {
      url: 'http://localhost:4000/users/login',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      data: {
        id: id,
        password: password,
      },
    };

    axios(option)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('accountname', res.data.accountname);

        alert('로그인 되었습니다.');
      })
      .catch((err) => {
        alert('아이디 또는 비밀번호가 틀렸습니다.');
      });
  };
  return (
    <div>
      <h1>Login</h1>

      <input
        placeholder='아이디'
        onChange={(e) => {
          setId(e.target.value);
        }}
      ></input>
      <input
        placeholder='비밀번호'
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      ></input>
      <button type='button' onClick={handleSubmit}>
        로그인
      </button>
    </div>
  );
};

export default Login;
