import React from 'react';
import { styled } from 'styled-components';

const MainHeadingLayout = ({ MainheadingName }) => {
  return <H2>{MainheadingName}</H2>;
};

export default MainHeadingLayout;

const H2 = styled.h2`
  font-size: var(--fs-lg);
  font-weight: 700;
  margin: 0 0 3rem;
`;
