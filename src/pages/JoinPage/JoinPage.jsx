import React from 'react';
import { styled } from 'styled-components';
import Button from './../../components/common/Button/Button';

const JoinPage = () => {
  return (
    <>
      <InputWrapper>
        <h2 className='sr-only'>회원가입 페이지입니다.</h2>
        <Label htmlFor='test'>email address</Label>
        <Input type='text' id='test' />
        <Button size='sm' disabled={true}>
          확인
        </Button>
      </InputWrapper>
    </>
  );
};

export default JoinPage;

const InputWrapper = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const Label = styled.label`
  font-size: var(--fs-lg);
`;

const Input = styled.input`
  font-size: var(--fs-lg);
  border: 1px solid black;
  padding: 1rem;
`;
