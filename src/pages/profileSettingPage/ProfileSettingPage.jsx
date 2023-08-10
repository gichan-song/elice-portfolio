import React, { useState } from 'react';
import { styled } from 'styled-components';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import Button from '../../components/common/Button/Button';
import ProfileEdit from './ProfileEdit/ProfileEdit';
import MyScrapList from './MyScrapList/MyScrapList';

const categories = ['프로필 수정', '내 스크랩'];

const ProfileSettingPage = () => {
  const [selectedMenu, setSelectedMenu] = useState('프로필 수정');

  return (
    <>
      <MainHeadingLayout MainheadingName='내 프로필 관리' />
      <Nav>
        <Ul>
          {categories.map((category) => (
            <Li
              key={category}
              $selectedMenu={selectedMenu === category}
              onClick={() => {
                setSelectedMenu(category);
              }}
            >
              <Button type='category' active={selectedMenu === category}>
                {category}
              </Button>
            </Li>
          ))}
        </Ul>
      </Nav>
      {selectedMenu === '프로필 수정' && <ProfileEdit />}
      {selectedMenu === '내 스크랩' && <MyScrapList />}
    </>
  );
};

export default ProfileSettingPage;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  border-radius: 1rem;
`;

const Ul = styled.nav`
  display: flex;
  gap: 2rem;
`;

const Li = styled.li`
  /* font-size: var(--fs-md);
  font-weight: 700;
  padding: 1rem;
  background: ${(props) => (props.$selectedMenu ? 'var(--main-color)' : 'var(--text-color)')};
  color: ${(props) => (props.$selectedMenu ? 'var(--text-white-color)' : 'var(--text-color)')};
  border: 1px solid ${(props) => (props.$selectedMenu ? 'var(--main-color)' : 'var(--border-color)')};
  border-radius: 1rem;
  cursor: pointer; */
`;
