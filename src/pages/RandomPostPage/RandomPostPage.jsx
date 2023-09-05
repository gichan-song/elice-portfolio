import React, { useCallback, useContext, useEffect, useState } from 'react';
import API from '../../api/API';
import ENDPOINT from '../../api/ENDPOINT';
import MainHeadingLayout from '../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import questionMarkIcon from '../../assets/icons/question-mark-icon.svg';
import { mediaMaxWidth } from './../../styles/GlobalStyle';
import { AuthContextStore } from '../../context/AuthContext';

const RandomPostPage = () => {
  const { userToken } = useContext(AuthContextStore);

  const navigate = useNavigate();

  const [randomPost, setRandomPost] = useState();
  const [clickedPosts, setClickedPosts] = useState([]);

  const getRandomPost = useCallback(() => {
    API(`${ENDPOINT.RANDOM}`, 'GET')
      .then((res) => {
        setRandomPost(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getRandomPost();
  }, [getRandomPost]);

  const handleMovePage = (postId) => {
    if (userToken) {
      navigate(`/post/${postId}`);
    } else if (!userToken) {
      alert('로그인 후 상세 레시피를 확인해 보세요!');
    }
  };

  const handlePostClick = (index) => {
    if (clickedPosts.includes(index)) {
      setClickedPosts(clickedPosts.filter((item) => item !== index));
    } else {
      setClickedPosts([...clickedPosts, index]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.card-container').style.opacity = 1;
      document.querySelector('.card-container').style.transform = 'translateY(0)';
    }, 100);
  }, []);

  const handleReset = () => {
    setClickedPosts([]);
    setTimeout(() => {
      getRandomPost();
    }, 300);
  };

  return (
    <>
      <MainHeadingLayout mainheadingName='뭐 먹을까?' />
      <DescriptionP>
        어떤 음식을 먹을지 고민되시나요?
        <br />
        카드를 선택해 보세요. 다양한 레시피를 무작위로 보여드립니다!
      </DescriptionP>
      <CardContainer className='card-container'>
        {randomPost &&
          randomPost.map((post, index) => (
            <Div className='flipper' key={post._id}>
              <Div className='card' $clickedPostIndex={clickedPosts.includes(index)}>
                <Div className='front'>
                  <CardFront
                    onClick={() => {
                      handlePostClick(index);
                    }}
                  >
                    <QuestionMarkImg src={questionMarkIcon} alt='랜덤 레시피 카드 앞면의 물음표 이미지' />
                  </CardFront>
                </Div>
                <Div className='back'>
                  <Article>
                    <img src={post.thumbnail} alt={`${post.title} 사진입니다.`} />
                    <ImgCover
                      onClick={() => {
                        handleMovePage(post._id);
                      }}
                    >
                      <Ul>
                        <Li className='ellipsis'>{post.category}</Li>
                        <Li className='ellipsis'>{post.title}</Li>
                      </Ul>
                    </ImgCover>
                  </Article>
                </Div>
              </Div>
            </Div>
          ))}
      </CardContainer>
      {clickedPosts.length !== 0 && (
        <ResetButton type='button' onClick={handleReset}>
          Reset
        </ResetButton>
      )}
    </>
  );
};

export default RandomPostPage;

const DescriptionP = styled.p`
  font-size: var(--fs-md);
  width: 80%;
  margin: 5rem auto;
  text-align: center;
  word-break: keep-all;
  padding: 1rem;
  background-color: #333;
  color: var(--text-white-color);
  border-radius: 1rem;
  line-height: 1.4;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: ${mediaMaxWidth}) {
    margin: 4rem auto;
    font-size: var(--fs-sm);
    padding: 0.6rem;
  }
`;

const Div = styled.div`
  &.flipper {
    width: 50%;
    aspect-ratio: 1;
    position: relative;
    perspective: 110rem;
    border-radius: 1rem;
    overflow: hidden;
  }

  &.card {
    width: 100%;
    height: 100%;
    position: relative;
    transition: 0.4s;
    transform-style: preserve-3d;
    cursor: pointer;

    transform: ${(props) => (props.$clickedPostIndex ? 'rotateY(-180deg)' : 'none')};
  }

  &.front,
  &.back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  &.back {
    transform: rotateY(180deg);
  }

  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  gap: 2rem;
  opacity: 0;
  transform: translateY(6rem);
  transition: opacity 0.8s, transform 0.8s;

  @media (max-width: ${mediaMaxWidth}) {
    gap: 1rem;
  }
`;

const CardFront = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--sub-basic-color);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionMarkImg = styled.img`
  width: 50%;
  height: 50%;
`;

const Article = styled.article`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImgCover = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgb(35, 35, 35, 0.6) 0%, rgba(35, 35, 35, 0) 20%);
  cursor: pointer;
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0.6rem;
  gap: 0.4rem;
`;

const Li = styled.li`
  color: white;

  &:nth-child(1) {
    color: var(--main-color);
  }
`;

const ResetButton = styled.button`
  width: 10%;
  aspect-ratio: 1;
  font-size: var(--fs-md);
  font-weight: 500;
  border-radius: 50%;
  background-color: var(--main-color);
  color: var(--text-white-color);
  margin: 5rem auto 0;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: var(--sub-darker-color);
    transform: scale(1.05);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background-color: var(--sub-darker-color);
    transform: scale(0.95);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  }
`;
