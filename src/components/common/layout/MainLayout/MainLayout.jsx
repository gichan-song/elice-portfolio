import styled from 'styled-components';
import Header from '../../Header/Header';
import TabMenu from '../../TabMenu/TabMenu';

const MainLayout = ({ children }) => {
  return (
    <>
      <MainContainer>
        <Header />
        <ScreenContainer>{children}</ScreenContainer>
        <TabMenu />
      </MainContainer>
    </>
  );
};

export default MainLayout;

const MainContainer = styled.div`
  position: relative;
  min-width: 32rem;
  max-width: 72rem;
  min-height: 100vh;
  margin: 0 auto;
  background-color: var(--main-bg-color);
  box-shadow: rgb(0 0 0 / 16%) 0px 0px 8px;
`;

const ScreenContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 11rem); // header(5rem), tabMenu(6rem) 높이를 제외한 값
  flex-direction: column;
  padding: 3rem;
  min-width: 32rem;

  @media (max-width: 360px) {
    padding: 1.5rem;
  }
`;
