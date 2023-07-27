import React from 'react';
import { styled } from 'styled-components';

const SubHeadingLayout = ({ subHeadingName }) => {
  return <H3>{subHeadingName}</H3>;
};

export default SubHeadingLayout;

const H3 = styled.h3`
  font-size: var(--fs-md);
  font-weight: 500;
  margin: 0 0 2rem;
`;
