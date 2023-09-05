import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContextStore } from '../context/AuthContext';

import NonAuthRoute from './NonAuthRoute';
import AuthRoute from './AuthRoute';

import HomePage from '../pages/HomePage/HomePage';
import JoinPage from '../pages/JoinPage/JoinPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import PostUploadPage from '../pages/postPage/PostUploadPage/PostUploadPage';
import PostDetailPage from '../pages/postPage/postDetailPage/PostDetailPage';
import PostEditPage from '../pages/postPage/PostEditPage/PostEditPage';
import ProfileSettingPage from '../pages/profileSettingPage/ProfileSettingPage';
import SearchPage from '../pages/SearchPage/SearchPage';
import MyScrapList from '../pages/profileSettingPage/MyScrapList/MyScrapList';
import GuidePage from '../pages/guidePage/GuidePage';
import RandomPostPage from '../pages/RandomPostPage/RandomPostPage';
import NotFoundpage from '../pages/NotFoundPage/NotFoundPage';

const Router = () => {
  const { token } = useContext(AuthContextStore);

  return (
    <Routes>
      <Route path='*' element={<NotFoundpage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/random' element={<RandomPostPage />} />
      <Route path='/notfound' element={<NotFoundpage />} />

      <Route element={<NonAuthRoute authenticated={token} />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/join' element={<JoinPage />} />
      </Route>

      <Route element={<AuthRoute authenticated={token} />}>
        <Route path='/post' element={<PostUploadPage />} />
        <Route path='/post/:postid' element={<PostDetailPage />} />
        <Route path='/post/edit/:postid' element={<PostEditPage />} />
        <Route path='/profile/edit' element={<ProfileSettingPage />} />
        <Route path='/profile/myscrap' element={<MyScrapList />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/guide' element={<GuidePage />} />
      </Route>
    </Routes>
  );
};

export default Router;
