import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

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

const SideMenu = ({ contentRef }) => {
  // 사이드바 열렸을 때, 스크롤 막기
  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);

  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleMainMenuClick = (menuName) => {
    setExpandedMenu((prevExpandedMenu) => (prevExpandedMenu === menuName ? null : menuName));
  };

  return (
    <>
      <Aside ref={contentRef}>
        <nav>
          <MainUl>
            {menuList.map((menu) => (
              <MainMenuLi key={menu.name}>
                <MainMenuSpan onClick={() => handleMainMenuClick(menu.name)} $isExpanded={expandedMenu === menu.name}>
                  {menu.name}
                </MainMenuSpan>
                {menu.subMenu && expandedMenu === menu.name && (
                  <SubUl>
                    {menu.subMenu.map((subMenu) => (
                      <SubLi key={subMenu.name}>{subMenu.name}</SubLi>
                    ))}
                  </SubUl>
                )}
              </MainMenuLi>
            ))}
          </MainUl>
        </nav>
      </Aside>
      <SideMenuOverlay></SideMenuOverlay>
    </>
  );
};

export default SideMenu;

const Aside = styled.aside`
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  min-height: 100vh;
  padding: 10rem 3rem;
  background: #ffffff;
  z-index: 100;
`;

const MainUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const MainMenuLi = styled.li`
  font-size: var(--fs-xl);
  font-weight: 700;
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
`;

const SubLi = styled.li`
  font-size: var(--fs-md);
  color: var(--text-color);
  text-indent: 2rem;
  cursor: pointer;
`;

const SideMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;
