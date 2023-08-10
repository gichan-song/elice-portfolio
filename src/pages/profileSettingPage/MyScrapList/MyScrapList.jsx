import React from 'react';
import Post from '../../../components/common/post/Post';
import { styled } from 'styled-components';

const MyScrapList = () => {
  return (
    <>
      <Container>
        <Post accountname='test1' />
        <Post accountname='test2' />
        <Post accountname='test3' />
      </Container>
    </>
  );
};

export default MyScrapList;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
`;
