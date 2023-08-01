import React from 'react';
import { styled } from 'styled-components';
import SubHeadingLayout from '../../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';

const Steps = () => {
  return (
    <>
      <SubHeadingLayout subHeadingName='조리 순서'>
        <OrderInfoContainer>
          <OrderInfo>
            <StepSpan>{'STEP 1'}</StepSpan>
            <OrderContent>{`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`}</OrderContent>
            <OrderImg src='https://source.unsplash.com/random/?food' alt='' />
          </OrderInfo>
          <OrderInfo>
            <StepSpan>{'STEP 2'}</StepSpan>
            <OrderContent>{`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`}</OrderContent>
            <OrderImg src='https://source.unsplash.com/random/?cook' alt='' />
          </OrderInfo>
        </OrderInfoContainer>
      </SubHeadingLayout>
    </>
  );
};

export default Steps;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
`;

const OrderInfo = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 1.5rem;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  background: var(--sub-lighter-color);
  border-radius: 1rem;
`;

const StepSpan = styled.span`
  font-size: var(--fs-xs);
  font-weight: 700;
  white-space: nowrap;
`;

const OrderContent = styled.p`
  width: 45rem;
  min-height: 10rem;
  border: 1px solid var(--border-light-color);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--main-bg-color);
  font-size: var(--fs-sm);
`;

const OrderImg = styled.img`
  display: block;
  width: 14rem;
  height: 10rem;
  border-radius: 1rem;
  background: var(--sub-basic-color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
  cursor: pointer;
`;
