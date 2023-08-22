import React, { useCallback, useEffect, useState } from 'react';
import MainHeadingLayout from '../../../components/common/layout/MainHeadingLayout/MainHeadingLayout';
import Intro from './Intro/Intro';
import Steps from './Steps/Steps';
import Comment from './Comment/Comment';
import { useParams } from 'react-router-dom';
import API from '../../../api/API';
import ENDPOINT from '../../../api/ENDPOINT';

const PostDetailPage = () => {
  const params = useParams();

  const [postInfo, setPostInfo] = useState('');
  console.log(postInfo);

  // 레시피 상세 조회
  const getPostInfo = useCallback(() => {
    API(`${ENDPOINT.POSTS}/${params.postid}`, 'GET')
      .then((res) => {
        console.log(res);
        setPostInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, [params]);

  useEffect(() => {
    getPostInfo();
  }, [getPostInfo]);

  return (
    <>
      <MainHeadingLayout mainheadingName='레시피 상세 페이지' />
      <Intro postInfo={postInfo} />
      <Steps postInfo={postInfo} />
      <Comment postInfo={postInfo} getPostInfo={getPostInfo} />
    </>
  );
};

export default PostDetailPage;
