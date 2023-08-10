import { styled } from 'styled-components';
import menuIcon from '../../../assets/icons/menu-icon.svg';
import SideMenu from './../SideMenu/SideMenu';
import useModal from '../../../hooks/useModal';
import logo from '../../../assets/icons/logo.svg';

const Header = () => {
  const [modalOpen, toggle, targetRef, contentRef] = useModal();

  return (
    <HeaderContainer>
      <MenuIcon src={menuIcon} alt='' onClick={toggle} ref={targetRef} />
      <h1>
        <a href='/'>
          <LogoImg src={logo} alt='요리보고 로고' />
        </a>
      </h1>
      <DummySpace></DummySpace>
      {modalOpen && <SideMenu contentRef={contentRef} toggle={toggle} />}
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
  background: var(--main-color);
  padding: 0 2rem;
  z-index: 100;
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
