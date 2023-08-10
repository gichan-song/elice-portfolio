import React, { useContext, useState } from 'react';
import homeIcon from '../../../assets/icons/home-icon.svg';
import homeFillIcon from '../../../assets/icons/home-fill-icon.svg';
import uploadIcon from '../../../assets/icons/upload-icon.svg';
import uploadFillIcon from '../../../assets/icons/upload-fill-icon.svg';
import searchIcon from '../../../assets/icons/search-icon.svg';
import searchFillIcon from '../../../assets/icons/search-fill-icon.svg';
import userIcon from '../../../assets/icons/user-icon.svg';
import userFillIcon from '../../../assets/icons/user-fill-icon.svg';
import loginIcon from '../../../assets/icons/login-icon.svg';
import loginFillIcon from '../../../assets/icons/login-fill-icon.svg';
import { styled } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContextStore } from '../../../context/AuthContext';

const TabMenu = () => {
  const { token } = useContext(AuthContextStore);

  const navigate = useNavigate();
  const location = useLocation();

  // const nickname = 'test';

  const MenuList = [
    {
      name: '홈',
      path: '/',
      nonActive: homeIcon,
      active: homeFillIcon,
    },
    {
      name: '글 작성',
      path: '/post',
      nonActive: uploadIcon,
      active: uploadFillIcon,
    },
    {
      name: '검색',
      path: '/search',
      nonActive: searchIcon,
      active: searchFillIcon,
    },
    // 로그인 여부에 따라 다른 메뉴 구성
    token
      ? {
          name: '프로필',
          // path: `/profile/${nickname}`,
          path: '/profile',
          nonActive: userIcon,
          active: userFillIcon,
        }
      : {
          name: '로그인',

          path: '/login',
          nonActive: loginIcon,
          active: loginFillIcon,
        },
  ];

  return (
    <>
      <Nav>
        <Ul>
          {MenuList.map((menu) => (
            <Li
              key={menu.name}
              onClick={() => {
                navigate(menu.path);
              }}
            >
              <MenuImg
                src={location.pathname === menu.path ? menu.active : menu.nonActive}
                alt={`${menu.name} 아이콘`}
              />
              <MenuName $selectedMenu={location.pathname === menu.path}>{menu.name}</MenuName>
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
