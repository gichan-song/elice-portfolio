import React from 'react';
import { styled } from 'styled-components';

const MainHeadingLayout = ({ mainheadingName }) => {
  return <H2>{mainheadingName}</H2>;
};

export default MainHeadingLayout;

const H2 = styled.h2`
  font-size: var(--fs-lg);
  font-weight: 700;
  margin-bottom: 3rem;
`;
