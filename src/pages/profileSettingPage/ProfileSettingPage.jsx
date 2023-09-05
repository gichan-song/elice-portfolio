import React, { useState } from 'react';
import { styled } from 'styled-components';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import Button from '../../components/common/Button/Button';
import ProfileEdit from './ProfileEdit/ProfileEdit';
import { useNavigate } from 'react-router-dom';

const categories = ['프로필 수정', '내 스크랩'];

const ProfileSettingPage = () => {
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState('프로필 수정');

  // 클릭 시, 해당 페이지 이동
  const onClickMovePageHandler = (category) => {
    if (category === '프로필 수정') {
      navigate('/profile/edit');
    } else if (category === '내 스크랩') {
      navigate('/profile/myscrap');
    }
  };

  return (
    <>
      <MainHeadingLayout mainheadingName='내 프로필 관리' />
      <Container>
        <Nav>
          <Ul>
            {categories.map((category) => (
              <li
                key={category}
                $selectedMenu={selectedMenu === category}
                onClick={() => {
                  setSelectedMenu(category);
                  onClickMovePageHandler(category);
                }}
              >
                <Button type='category' active={selectedMenu === category}>
                  {category}
                </Button>
              </li>
            ))}
          </Ul>
        </Nav>
      </Container>
      <ProfileEdit />
    </>
  );
};

export default ProfileSettingPage;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  border-radius: 1rem;
`;

const Ul = styled.nav`
  display: flex;
  gap: 2rem;
`;
