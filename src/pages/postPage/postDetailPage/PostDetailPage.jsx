import React, { useState } from 'react';
import { styled } from 'styled-components';
import MainHeadingLayout from '../../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import Intro from './Intro/Intro';
import Steps from './Steps/Steps';
import Comment from './Comment/Comment';

const PostDetailPage = () => {
  return (
    <>
      <MainHeadingLayout MainheadingName='레시피 상세 페이지' />
      <Intro />
      <Steps />
      <Comment />
    </>
  );
};

export default PostDetailPage;
