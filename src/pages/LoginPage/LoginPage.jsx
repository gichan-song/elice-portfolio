import React, { useContext } from 'react';
import MainHeadingLayout from '../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import { styled } from 'styled-components';
import useInput from '../../hooks/useInput';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import API from '../../api/API';
import ENDPOINT from '../../api/ENDPOINT';
import { AuthContextStore } from '../../context/AuthContext';

const LoginPage = () => {
  const { setToken, setNickname } = useContext(AuthContextStore);

  const email = useInput('', 'login_email');
  const password = useInput('', 'login_password');

  // 로그인
  const handleLogin = () => {
    API(`${ENDPOINT.LOGIN}`, 'POST', {
      id: email.value,
      password: password.value,
    })
      .then((res) => {
        console.log(res);
        saveUserInfo(res);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === 'User not found') {
          email.setShowValidationMessage(true);
        } else if (err.response.data.message === 'Password is incorrect') {
          password.setShowValidationMessage(true);
        }
      });
  };

  const saveUserInfo = (res) => {
    const token = res.data.token;
    // const nickname = res.data.nickname;

    localStorage.setItem('token', token);
    // localStorage.setItem('nickname', nickname);

    setToken(token);
    // setNickname(nickname);
  };

  return (
    <>
      <MainHeadingLayout MainheadingName='로그인' />
      <Container>
        <InputContainer>
          <Input
            labelName='아이디'
            type='text'
            id='email'
            placeholder='이메일 주소를 입력해 주세요.'
            maxLength='30'
            {...email}
          />
          <Input
            labelName='비밀번호'
            type='password'
            id='password'
            placeholder='비밀번호를 입력해 주세요.'
            maxLength='14'
            {...password}
          />
        </InputContainer>
        <Button type='login' disabled={!(email.value && password.value)} onClickHandler={handleLogin}>
          로그인
        </Button>
        <Anchor href='/join'>
          <button>회원가입</button>
        </Anchor>
      </Container>
    </>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  width: 100%;
  margin: 0 auto;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 3rem;
`;

const Anchor = styled.a`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 5rem;
  padding: 0.6rem;
  font-size: var(--fs-sm);
  border: 1px solid var(--sub-darker-color);
  border-radius: 1rem;
  transform: translateY(-2rem);

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }
`;
