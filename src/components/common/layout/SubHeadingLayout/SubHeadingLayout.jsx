import React from 'react';
import { styled } from 'styled-components';

const SubHeadingLayout = ({ subHeadingName, children }) => {
  return (
    <>
      <Section>
        <H3>{subHeadingName}</H3>
        {children}
      </Section>
    </>
  );
};

export default SubHeadingLayout;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const H3 = styled.h3`
  font-size: var(--fs-md);
  font-weight: 500;
  margin-bottom: 2rem;
`;
