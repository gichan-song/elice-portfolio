import React, { useEffect, useState } from 'react';
import Post from './../../components/common/post/Post';
import { styled } from 'styled-components';
import CategoryMenu from './../../components/common/CategoryMenu/CategoryMenu';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import API from '../../api/API';
import ENDPOINT from '../../api/ENDPOINT';
import { mediaMaxWidth } from './../../styles/GlobalStyle';

const HomePage = () => {
  const [selectedCategory, SetselectedCategory] = useState('전체');

  // 선택된 카테고리 가져오기
  const getSelectedCategory = (category) => {
    SetselectedCategory(category);
  };

  const [postInfo, setPostInfo] = useState('');
  console.log(postInfo);

  // 전체 게시물 가져오기
  useEffect(() => {
    if (selectedCategory === '전체') {
      API(`${ENDPOINT.POSTS}?countperpage=999&pageno=1`, 'GET')
        .then((res) => {
          console.log(res);
          setPostInfo(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      API(`${ENDPOINT.POSTS}/category?category=${selectedCategory}`, 'GET')
        .then((res) => {
          console.log(res);
          setPostInfo(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedCategory]);

  return (
    <>
      <MainHeadingLayout mainheadingName='피드' />
      <CategoryMenu getSelectedCategory={getSelectedCategory} />
      <Container>{postInfo && postInfo.map((post) => <Post key={post._id} postInfo={post} />)}</Container>
    </>
  );
};

export default HomePage;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${mediaMaxWidth}) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
