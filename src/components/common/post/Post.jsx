import { useContext, useState } from 'react';
import { styled } from 'styled-components';
import profileIcon from '../../../assets/icons/profile-icon.svg';
import bookmarkIcon from '../../../assets/icons/bookmark-icon.svg';
import bookmarkFillIcon from '../../../assets/icons/bookmark-fill-icon.svg';
import heartIcon from '../../../assets/icons/heart-icon.svg';
import heartFillIcon from '../../../assets/icons/heart-fill-icon.svg';
import commentIcon from '../../../assets/icons/comment-icon.svg';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/API';
import ENDPOINT from './../../../api/ENDPOINT';
import { AuthContextStore } from '../../../context/AuthContext';

const Post = ({ postInfo }) => {
  const { token } = useContext(AuthContextStore);

  const navigate = useNavigate();

  // 좋아요 기능
  const [isLiked, setIsLiked] = useState(postInfo.isLiked);
  const [likesCount, setLikesCount] = useState(postInfo.likesCount);

  const handleLike = (id) => {
    postInfo._id &&
      API(`${ENDPOINT.POSTS}/${id}/like`, 'POST')
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
  };

  // 스크랩 기능
  const [isBookmarked, setIsBookmarked] = useState(postInfo.isScrapped);

  const handleScrap = (id) => {
    postInfo._id &&
      API(`${ENDPOINT.SCRAP}/${id}`, 'POST')
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
  };

  // 레시피 상세 페이지 이동
  const HandlePage = () => {
    if (token) {
      navigate(`/post/${postInfo._id}`, {
        state: {
          postInfo: postInfo,
        },
      });
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

  return (
    <>
      <Article>
        <Test>
          <H3>
            <ProfileImg
              src={postInfo.user.profileImg ? postInfo.user.profileImg : profileIcon}
              alt={`${postInfo.user.nickname}의 프로필 사진입니다.`}
              onClick={() => {
                console.log('프로필 확인 기능이 들어갈 곳입니다.');
              }}
            />
            <UserNameSpan
              onClick={() => {
                console.log('프로필을 확인 기능이 들어갈 곳입니다.');
              }}
            >
              <Strong>{postInfo.user.nickname}</Strong>님의 레시피
            </UserNameSpan>
          </H3>
          <PostContainer>
            <PostImg
              src={postInfo.thumbnail ? postInfo.thumbnail : 'https://source.unsplash.com/random/?food'}
              alt=''
              onClick={HandlePage}
            />
          </PostContainer>
          <PostInfoContainer>
            <CategoryAndTitle>
              <Category>{postInfo.category}</Category>
              <Name className='ellipsis'>{postInfo.title}</Name>
            </CategoryAndTitle>
            <PostInfo>
              <HeartWrapper>
                <HeartImg
                  src={isLiked ? heartFillIcon : heartIcon}
                  alt='좋아요 아이콘'
                  onClick={() => {
                    if (token) {
                      handleLike(postInfo._id);
                      setIsLiked((cur) => !cur);
                      setLikesCount((cur) => (isLiked ? cur - 1 : cur + 1));
                    } else {
                      alert('로그인 후 이용 가능합니다.');
                    }
                  }}
                />
                <Count>{likesCount}</Count>
              </HeartWrapper>
              <CommentWrapper>
                <CommentImg src={commentIcon} alt='댓글 아이콘' />
                <Count>{postInfo.commentsCount}</Count>
              </CommentWrapper>
              <BookmarkWrapper>
                <BookmarkImg
                  src={isBookmarked ? bookmarkFillIcon : bookmarkIcon}
                  alt='스크랩'
                  onClick={() => {
                    if (token) {
                      setIsBookmarked((cur) => !cur);
                      handleScrap(postInfo._id);
                    } else {
                      alert('로그인 후 이용 가능합니다.');
                    }
                  }}
                />
              </BookmarkWrapper>
            </PostInfo>
          </PostInfoContainer>
        </Test>
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

const Test = styled.div`
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 1rem;
`;

const H3 = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
`;

const ProfileImg = styled.img`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const UserNameSpan = styled.span`
  font-size: var(--fs-sm);
  font-weight: 500;
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
  cursor: pointer;
`;

const PostInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width: 100%; */
`;

const CategoryAndTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Category = styled.span`
  color: var(--text-color);
  font-size: var(--fs-xs);
`;

const Name = styled.span`
  font-size: var(--fs-xs);
  font-weight: 500;
  color: var(--text-color);
  word-break: break-all;
`;

// 좋아요 & 댓글 & 스크랩
const PostInfo = styled.div`
  display: flex;
  gap: 0.6rem;
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
