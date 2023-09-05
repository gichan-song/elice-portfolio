import React from 'react';
import { styled } from 'styled-components';

const NotFoundpage = () => {
  return (
    <>
      <Container>Page not found</Container>
    </>
  );
};

export default NotFoundpage;

const Container = styled.div`
  font-size: var(--fs-xl);
  text-align: center;
  margin: auto;
`;
