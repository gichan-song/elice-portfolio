import React, { useEffect } from 'react';
import { styled } from 'styled-components';

const SideMenu = ({ contentRef }) => {
  // 사이드바 열렸을 때, 스크롤 막기
  useEffect(() => {
    document.body.style = `overflow: hidden`;
    return () => (document.body.style = `overflow: auto`);
  }, []);

  return (
    <>
      <Aside ref={contentRef}>
        <nav>
          <ul>
            <li>
              <a href='/'>키친 가이드</a>
              <ul>
                <li>보관법</li>
                <li>손질법</li>
                <li>기타</li>
              </ul>
            </li>
            <li>내 스크랩</li>
            <li>뭐 먹을까?</li>
          </ul>
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
  background: #ffffff;
  z-index: 100;
`;

const SideMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
`;
