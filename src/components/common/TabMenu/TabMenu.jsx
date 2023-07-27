import React, { useState } from 'react';
import homeIcon from '../../../assets/icons/home-icon.svg';
import homeFillIcon from '../../../assets/icons/home-fill-icon.svg';
import uploadIcon from '../../../assets/icons/upload-icon.svg';
import uploadFillIcon from '../../../assets/icons/upload-fill-icon.svg';
import searchIcon from '../../../assets/icons/search-icon.svg';
import searchFillIcon from '../../../assets/icons/search-fill-icon.svg';
import userIcon from '../../../assets/icons/user-icon.svg';
import userFillIcon from '../../../assets/icons/user-fill-icon.svg';
import { styled } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const MenuList = [
  {
    name: '홈',
    move: '/',
    nonActive: homeIcon,
    active: homeFillIcon,
  },
  {
    name: '글 작성',
    move: '/post',
    nonActive: uploadIcon,
    active: uploadFillIcon,
  },
  {
    name: '검색',
    move: '/search',
    nonActive: searchIcon,
    active: searchFillIcon,
  },
  {
    name: '프로필',
    move: '/profile',
    nonActive: userIcon,
    active: userFillIcon,
  },
];

const TabMenu = () => {
  const navigate = useNavigate();

  const location = useLocation();
  // console.log(location.pathname);

  const [selectedMenu, setSelectedMenu] = useState('홈');

  return (
    <>
      <Nav>
        <Ul>
          {MenuList.map((menu) => (
            <Li
              key={menu.name}
              onClick={() => {
                setSelectedMenu(menu.name);
                navigate(menu.move);
              }}
            >
              <MenuImg src={selectedMenu === menu.name ? menu.active : menu.nonActive} alt={`${menu.name} 아이콘`} />
              <MenuName $selectedMenu={selectedMenu === menu.name}>{menu.name}</MenuName>
            </Li>
          ))}
        </Ul>
      </Nav>
    </>
  );
};

export default TabMenu;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 6rem;
  border-top: 1px solid var(--border-color);
  background: var(--main-bg-color);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const Ul = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Li = styled.li`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;
`;

const MenuImg = styled.img`
  width: 3.2rem;
  height: 3.2rem;
`;

const MenuName = styled.span`
  font-weight: 500;
  color: ${(props) => (props.$selectedMenu ? 'var(--main-color)' : 'var(--text-color)')};
`;
