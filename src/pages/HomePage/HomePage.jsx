import React from 'react';
import Post from './../../components/common/post/Post';
import { styled } from 'styled-components';

const HomePage = () => {
  return (
    <>
      <Container>
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
        <Post accountname='test' />
      </Container>
    </>
  );
};

export default HomePage;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  padding: 3rem;
`;
