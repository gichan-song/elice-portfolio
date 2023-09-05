import React, { useCallback, useEffect, useState } from 'react';
import Post from '../../../components/common/post/Post';
import { styled } from 'styled-components';
import API from '../../../api/API';
import ENDPOINT from './../../../api/ENDPOINT';
import MainHeadingLayout from '../../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button/Button';
import { mediaMaxWidth } from '../../../styles/GlobalStyle';

const categories = ['프로필 수정', '내 스크랩'];

const MyScrapList = () => {
  const [postInfo, setPostInfo] = useState([]);

  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState('내 스크랩');

  // 클릭 시, 해당 페이지 이동
  const onClickMovePageHandler = (category) => {
    if (category === '프로필 수정') {
      navigate('/profile/edit');
    } else if (category === '내 스크랩') {
      navigate('/profile/myscrap');
    }
  };

  const getUserInfo = useCallback(() => {
    API(`${ENDPOINT.GET_USER_SCRAPS_INFO}`, 'GET')
      .then((res) => {
        setPostInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <>
      <MainHeadingLayout mainheadingName='내 프로필 관리' />
      <Container>
        <Nav>
          <Ul>
            {categories.map((category) => (
              <Li
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
              </Li>
            ))}
          </Ul>
        </Nav>
      </Container>
      <PostContainer>
        {postInfo.length ? (
          postInfo.map((post) => <Post key={post._id} postInfo={post} />)
        ) : (
          <p>아직 스크랩한 게시물이 없습니다.</p>
        )}
      </PostContainer>
    </>
  );
};

export default MyScrapList;

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

const Li = styled.li``;

const PostContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${mediaMaxWidth}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
