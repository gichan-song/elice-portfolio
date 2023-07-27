import { useState } from 'react';
import { styled } from 'styled-components';
import profileIcon from '../../../assets/icons/profile-icon.svg';
import bookmarkIcon from '../../../assets/icons/bookmark-icon.svg';
import bookmarkFillIcon from '../../../assets/icons/bookmark-fill-icon.svg';
import heartIcon from '../../../assets/icons/heart-icon.svg';
import heartFillIcon from '../../../assets/icons/heart-fill-icon.svg';
import commentIcon from '../../../assets/icons/comment-icon.svg';

const Post = ({ accountname }) => {
  //

  // 좋아요 기능
  const [isLiked, setIsLiked] = useState(false);

  // 스크랩 기능
  const [isBookMarked, setIsBookMarked] = useState(false);

  return (
    <>
      <Article>
        <H3>
          <ProfileImg
            src={profileIcon}
            alt={`${accountname}의 프로필 사진입니다.`}
            onClick={() => {
              console.log('프로필을 확인 기능이 들어갈 곳입니다.');
            }}
          />
          <UserNameSpan
            onClick={() => {
              console.log('프로필을 확인 기능이 들어갈 곳입니다.');
            }}
          >
            <Strong>{accountname}</Strong>님의 Recipe
          </UserNameSpan>
        </H3>
        <PostContainer>
          <PostImg src='https://source.unsplash.com/random/?food' alt='' />
        </PostContainer>
        <PostInfoContainer>
          <CategoryAndTitle>
            <Category>음식 카테고리</Category>
            <Name>음식 이름</Name>
          </CategoryAndTitle>
          <PostInfo>
            <HeartWrapper>
              <HeartImg
                src={isLiked ? heartFillIcon : heartIcon}
                alt='좋아요 아이콘'
                onClick={() => {
                  setIsLiked((cur) => !cur);
                }}
              />
              <Count>0</Count>
            </HeartWrapper>
            <CommentWrapper>
              <CommentImg src={commentIcon} alt='댓글 아이콘' />
              <Count>0</Count>
            </CommentWrapper>
            <BookmarkWrapper>
              <BookmarkImg
                src={isBookMarked ? bookmarkFillIcon : bookmarkIcon}
                alt='스크랩'
                onClick={() => {
                  setIsBookMarked((cur) => !cur);
                }}
              />
            </BookmarkWrapper>
          </PostInfo>
        </PostInfoContainer>
      </Article>
    </>
  );
};

export default Post;

const Article = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
`;

const H3 = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
`;

const ProfileImg = styled.img`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
`;

const UserNameSpan = styled.span`
  font-size: var(--fs-sm);
  font-weight: 700;
  cursor: pointer;
`;

const Strong = styled.strong`
  color: var(--main-color);
`;

const PostContainer = styled.div`
  position: relative;
  margin-bottom: 0.6rem;
`;

const PostImg = styled.img`
  border-radius: 1rem;
  aspect-ratio: 1;
`;

const PostInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryAndTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Category = styled.span`
  color: var(--text-color);
`;

const Name = styled.span`
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--text-color);
`;

// 좋아요 & 댓글 & 스크랩
const PostInfo = styled.div`
  display: flex;
  gap: 1rem;
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

// 스크랩
const BookmarkWrapper = styled(HeartWrapper)``;
const BookmarkImg = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`;
