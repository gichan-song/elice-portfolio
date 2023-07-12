import { styled } from 'styled-components';
import menuIcon from '../../../assets/icons/menu-icon.svg';
import SideMenu from './../SideMenu/SideMenu';
import useModal from '../../../hooks/useModal';

const Header = () => {
  const [modalOpen, toggle, targetRef, contentRef] = useModal();

  return (
    <HeaderContainer>
      <MenuIcon src={menuIcon} alt='' onClick={toggle} ref={targetRef} />
      <h1>
        <LogoImg src='' alt='' />
      </h1>
      <DummySpace></DummySpace>
      {modalOpen && <SideMenu contentRef={contentRef} />}
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #ffcd3c;
  padding: 0 2rem;
`;

const MenuIcon = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 12rem;
  height: 3.6rem;
`;

const DummySpace = styled.div`
  width: 3.2rem;
  height: 3.2rem;
`;
