import React, { useCallback, useEffect, useState } from 'react';
import API from '../../api/API';
import ENDPOINT from '../../api/ENDPOINT';
import MainHeadingLayout from '../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import questionMarkIcon from '../../assets/icons/question-mark-icon.svg';

const RandomPostPage = () => {
  const navigate = useNavigate();

  const [randomPost, setRandomPost] = useState();
  const [clickedPostIndex, setClickedPostIndex] = useState(-1);

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
    navigate(`/post/${postId}`);
  };

  const handlePostClick = (index) => {
    setClickedPostIndex(index === clickedPostIndex ? -1 : index);
    console.log('실행');
  };

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.card-container').style.opacity = 1;
      document.querySelector('.card-container').style.transform = 'translateY(0)';
    }, 100);
  }, []);

  const handleReset = () => {
    setClickedPostIndex(-1);
    getRandomPost();
  };

  return (
    <>
      <MainHeadingLayout mainheadingName='뭐 먹을까?' />
      <CardContainer className='card-container'>
        {randomPost &&
          randomPost.map((post, index) => (
            <Div className='flipper' key={post._id}>
              <Div className='card' $clickedPostIndex={index === clickedPostIndex}>
                <Div className='front'>
                  <Test
                    onClick={() => {
                      handlePostClick(index);
                    }}
                  >
                    <QMarkImg src={questionMarkIcon} alt='' />
                  </Test>
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
                        <Li>{post.category}</Li>
                        <Li>{post.title}</Li>
                      </Ul>
                    </ImgCover>
                  </Article>
                </Div>
              </Div>
            </Div>
          ))}
      </CardContainer>
      {clickedPostIndex !== -1 && (
        <ResetButton type='button' onClick={handleReset}>
          Reset
        </ResetButton>
      )}
    </>
  );
};

export default RandomPostPage;

const Test = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--sub-basic-color);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  &.flipper {
    width: 20rem;
    height: 20rem;
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
  display: flex;
  justify-content: center;
  margin: 16rem auto 0;
  gap: 2rem;

  opacity: 0;
  transform: translateY(6rem);
  transition: opacity 0.8s, transform 0.8s;
`;

const QMarkImg = styled.img`
  width: 10rem;
  height: 10rem;
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
`;

const ResetButton = styled.button`
  width: 8rem;
  height: 8rem;
  font-size: var(--fs-md);
  font-weight: 500;
  border-radius: 50%;
  background-color: var(--main-color);
  color: var(--text-white-color);
  margin: 6rem auto 0;
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
