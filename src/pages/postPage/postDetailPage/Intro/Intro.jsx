import React, { useEffect, useState } from 'react';
import { css, styled } from 'styled-components';
import SubHeadingLayout from '../../../../components/common/layout/SubHeadingLayout/SubHeadingLayout';
import profileIcon from '../../../../assets/icons/profile-icon.svg';
import bookmarkIcon from '../../../../assets/icons/bookmark-icon.svg';
import bookmarkFillIcon from '../../../../assets/icons/bookmark-fill-icon.svg';
import heartIcon from '../../../../assets/icons/heart-icon.svg';
import heartFillIcon from '../../../../assets/icons/heart-fill-icon.svg';
import commentIcon from '../../../../assets/icons/comment-icon.svg';
import { useNavigate } from 'react-router-dom';
import { mediaMaxWidth } from '../../../../styles/GlobalStyle';
import API from '../../../../api/API';
import ENDPOINT from '../../../../api/ENDPOINT';

const Intro = ({ postInfo }) => {
  console.log(postInfo);

  const navigate = useNavigate();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMyPost, setIsMyPost] = useState(false);

  // 자신의 게시물인지 확인
  useEffect(() => {
    postInfo &&
      API(`${ENDPOINT.GET_USER_INFO}`, 'GET')
        .then((res) => {
          console.table(res.data);
          if (res.data.nickname === postInfo.user.nickname) {
            setIsMyPost(true);
          } else {
            setIsMyPost(false);
          }
        })
        .catch((err) => console.log(err));
  }, [postInfo]);

  const handleModify = () => {
    console.log('수정하기 로직이 들어갈 곳입니다.');
    navigate(`/post/edit/${postInfo._id}`);
  };

  return (
    <>
      <SubHeadingLayout subHeadingName='요리 소개'>
        <RecipeContainer>
          <UserInfoContainer>
            <UserProfile>
              <UserProfileImg
                src={postInfo.user?.profileImg ? postInfo.user?.profileImg : profileIcon}
                alt='유저 프로필'
              />
              <UserName>
                <UserNameStrong>{postInfo.user?.nickname}</UserNameStrong>님의 Recipe
              </UserName>
            </UserProfile>
            <UserAction>
              {isMyPost && <ModifyBtn onClick={handleModify}>수정하기</ModifyBtn>}
              <BookmarkBtn
                onClick={() => {
                  setIsBookmarked((cur) => !cur);
                }}
              >
                <img src={isBookmarked ? bookmarkFillIcon : bookmarkIcon} alt='' />
              </BookmarkBtn>
            </UserAction>
          </UserInfoContainer>
          <RecipeInfoContainer>
            <TitleP>
              <CategoryStrong>{postInfo.category}</CategoryStrong>
              {postInfo.title}
            </TitleP>
            <ContentP>{postInfo.recipe}</ContentP>
            <RecipeResultContainer>
              <ResultImg src={postInfo.thumbnail ? postInfo.thumbnail : 'https://source.unsplash.com/random/?recipe'} />
              <HeartAndCommentContainer>
                <HeartWrapper>
                  <HeartImg
                    src={isLiked ? heartFillIcon : heartIcon}
                    alt='좋아요 아이콘'
                    onClick={() => {
                      setIsLiked((cur) => !cur);
                    }}
                  />
                  <Count>{postInfo.likes?.length}</Count>
                </HeartWrapper>
                <CommentWrapper>
                  <CommentImg src={commentIcon} alt='댓글 아이콘' />
                  <Count>{postInfo.comments?.length}</Count>
                </CommentWrapper>
              </HeartAndCommentContainer>
            </RecipeResultContainer>
          </RecipeInfoContainer>
        </RecipeContainer>
      </SubHeadingLayout>
    </>
  );
};

export default Intro;

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserProfile = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

const UserProfileImg = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  cursor: pointer;
`;

const UserName = styled.span`
  font-size: var(--fs-sm);
  font-weight: 500;
`;

const UserNameStrong = styled.strong`
  color: var(--main-color);
`;

const UserAction = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ModifyBtn = styled.button`
  font-size: var(--fs-sm);
  color: var(--text-color);
  font-weight: 700;
  word-break: keep-all;
`;

const BookmarkBtn = styled.button`
  width: 2.4rem;
`;

const RecipeInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: var(--sub-bg-color);
  border-radius: 1rem;

  @media (max-width: ${mediaMaxWidth}) {
    padding: 1rem;
    gap: 1rem;
  }
`;

// 제목, 내용의 공통 속성
const ContentStyles = css`
  width: 100%;
  height: 4rem;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  font-size: var(--fs-sm);
  background: #ffffff;

  &::placeholder {
    font-weight: 500;
  }

  &:focus {
    outline: none;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TitleP = styled.p`
  display: flex;
  align-items: center;
  gap: 1rem;
  ${ContentStyles}
  height: 100%;
`;

// 레시피 이름
const CategoryStrong = styled.strong`
  text-align: center;
  word-break: keep-all;
  border-radius: 1rem;
  padding: 0.6rem;
  background: var(--main-color);
  color: var(--text-white-color);
  font-size: var(--fs-sm);
  font-weight: 500;
`;

// 레시피 내용
const ContentP = styled.p`
  ${ContentStyles}
  height: 100%;
`;

// 레시피 완성 이미지 & 좋아요, 댓글 정보
const RecipeResultContainer = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${mediaMaxWidth}) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const ResultImg = styled.img`
  width: 50%;
  max-height: 20rem;
  border-radius: 1rem;
  background: var(--sub-bg-darker-color);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  /* object-fit: cover;*/

  @media (max-width: ${mediaMaxWidth}) {
    width: 100%;
  }
`;

const HeartAndCommentContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: end;
  gap: 1rem;

  @media (max-width: ${mediaMaxWidth}) {
    width: 100%;
  }
`;

// 좋아요
const HeartWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const HeartImg = styled.img`
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
`;

const Count = styled.span`
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text-color);
`;

// 댓글
const CommentWrapper = styled(HeartWrapper)``;
const CommentImg = styled(HeartImg)``;
