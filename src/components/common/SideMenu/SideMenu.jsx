import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import Button from '../Button/Button';
import { AuthContextStore } from '../../../context/AuthContext';
import { mediaMaxWidth } from '../../../styles/GlobalStyle';

const menuList = [
  {
    name: '키친 가이드',
    move: '',
    subMenu: [
      { name: '보관법', move: '/guide' },
      {
        name: '손질법',
        move: '/guide',
      },
      {
        name: '기타',
        move: '/guide',
      },
    ],
  },
  {
    name: '내 스크랩',
    move: '/mypage',
  },
  {
    name: '뭐 먹을까?',
    move: '/game',
  },
];

const SideMenu = ({ contentRef, toggle }) => {
  const { token, setToken } = useContext(AuthContextStore);
  const navigate = useNavigate();

  // 사이드바 열렸을 때, 스크롤 막기
  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);

  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleMainMenuClick = (menuName) => {
    setExpandedMenu((prevExpandedMenu) => (prevExpandedMenu === menuName ? null : menuName));
  };

  // 클릭 시, 가이드 페이지로 이동
  const onClickMoveGuidePageHandler = () => {
    toggle();
    navigate('/guide');
  };

  // 클릭 시, 내 스크랩  / 뭐 먹을까? 페이지 이동
  const onClickMoveScrapListPageHandler = (name) => {
    toggle();
    if (name === '내 스크랩') {
      navigate('/profile/myscrap');
    } else if (name === '뭐 먹을까?') {
      navigate('/game');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Aside ref={contentRef}>
        <nav>
          <MainUl>
            {menuList.map((menu) => (
              <MainMenuLi key={menu.name}>
                <MainMenuSpan
                  onClick={() => {
                    handleMainMenuClick(menu.name);
                    !menu.subMenu && onClickMoveScrapListPageHandler(menu.name);
                  }}
                  $isExpanded={expandedMenu === menu.name}
                >
                  {menu.name}
                </MainMenuSpan>
                {menu.subMenu && expandedMenu === menu.name && (
                  <SubUl>
                    {menu.subMenu.map((subMenu) => (
                      <SubLi
                        key={subMenu.name}
                        onClick={() => {
                          onClickMoveGuidePageHandler();
                        }}
                      >
                        {subMenu.name}
                      </SubLi>
                    ))}
                  </SubUl>
                )}
              </MainMenuLi>
            ))}
          </MainUl>
        </nav>
        {token ? (
          <Button type='logout' onClickHandler={handleLogout}>
            로그아웃
          </Button>
        ) : (
          <></>
        )}
      </Aside>
      <SideMenuOverlay></SideMenuOverlay>
    </>
  );
};

export default SideMenu;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  min-height: 100vh;
  padding: 10rem 3rem;
  background: #ffffff;
  z-index: 100;

  @media (max-width: ${mediaMaxWidth}) {
    width: 40%;
    padding: 10rem 1.5rem;
  }
`;

const MainUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (max-width: ${mediaMaxWidth}) {
    gap: 1rem;
  }
`;

const MainMenuLi = styled.li`
  font-size: var(--fs-xl);
  font-weight: 700;

  @media (max-width: ${mediaMaxWidth}) {
    font-size: var(--fs-md);
  }
`;

const MainMenuSpan = styled.span`
  display: block;
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: var(--main-color);
    color: var(--text-white-color);
  }
`;

const SubUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${mediaMaxWidth}) {
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const SubLi = styled.li`
  font-size: var(--fs-md);
  color: var(--text-color);
  text-indent: 2rem;
  cursor: pointer;

  @media (max-width: ${mediaMaxWidth}) {
    font-size: var(--fs-xs);
  }
`;

const SideMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;
