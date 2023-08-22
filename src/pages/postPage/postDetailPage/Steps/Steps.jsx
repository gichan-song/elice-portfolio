import React from 'react';
import { styled } from 'styled-components';
import SubHeadingLayout from '../../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';
import { mediaMaxWidth } from '../../../../styles/GlobalStyle';

const Steps = ({ postInfo }) => {
  return (
    <>
      <SubHeadingLayout subHeadingName='조리 순서'>
        <OrderInfoContainer>
          {postInfo &&
            postInfo.orders.map((item, index) => (
              <OrderInfo key={item._id}>
                <StepSpan>{`STEP ${index + 1}`}</StepSpan>
                <OrderWrapper>
                  <OrderContent>{item.content}</OrderContent>
                  <OrderImg
                    src={item.orderImage ? item.orderImage : 'https://source.unsplash.com/random/?food'}
                    alt={`${item.content}를 설명하는 사진입니다.`}
                  />
                </OrderWrapper>
              </OrderInfo>
            ))}
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

  @media (max-width: ${mediaMaxWidth}) {
    display: flex;
    flex-direction: column;
  }
`;

const StepSpan = styled.span`
  font-size: var(--fs-xs);
  font-weight: 700;
  white-space: nowrap;
`;

const OrderWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1.5rem;
`;

const OrderContent = styled.p`
  width: 100%;
  min-height: 10rem;
  border: 1px solid var(--border-light-color);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--main-bg-color);
  font-size: var(--fs-sm);

  @media (max-width: ${mediaMaxWidth}) {
    width: 50%;
  }
`;

const OrderImg = styled.img`
  width: 14rem;
  height: 10rem;
  border-radius: 1rem;
  background: var(--sub-basic-color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  aspect-ratio: 1;
  cursor: pointer;

  @media (max-width: ${mediaMaxWidth}) {
    width: 50%;
    min-height: 14rem;
  }
`;
