import styled from 'styled-components';
import Header from '../../Header/Header';

const MainLayout = ({ children }) => {
  return (
    <MainContainer>
      <Header />
      <ScreenContainer>{children}</ScreenContainer>
    </MainContainer>
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
  min-height: 100%;
  flex-direction: column;
`;
