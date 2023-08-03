import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './../../components/common/post/Post';
import { styled } from 'styled-components';
import CategoryMenu from './../../components/common/CategoryMenu/CategoryMenu';
import MainHeadingLayout from './../../components/common/layout/MainHeadingLayout/MainHeadingLayout';

const HomePage = () => {
  const [selectedCategory, SetselectedCategory] = useState('전체');
  const [posts, setPosts] = useState([]);

  // 선택된 카테고리 가져오기
  const getSelectedCategory = (category) => {
    SetselectedCategory(category);
  };

  useEffect(() => {
    const posts = axios.get('http://localhost:4000/posts').then((res) => {
      setPosts(res.data);
    });
  }, []);

  console.log(posts);

  return (
    <>
      <MainHeadingLayout MainheadingName='피드' />
      <CategoryMenu getSelectedCategory={getSelectedCategory} />
      <Container>
        <Post accountname='test1' />
        <Post accountname='test2' />
        <Post accountname='test3' />
        <Post accountname='test4' />
        <Post accountname='test5' />
      </Container>
    </>
  );
};

export default HomePage;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
`;
