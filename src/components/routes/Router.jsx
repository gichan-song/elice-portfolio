import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContextStore } from '../context/AuthContext';

import NonAuthRoute from './NonAuthRoute';
import AuthRoute from './AuthRoute';
import HomePage from './../../pages/HomePage/HomePage';
import JoinPage from '../../pages/JoinPage/JoinPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import NotFoundpage from '../../pages/NotFoundPage/NotFoundPage';
import TestPage from '../../pages/TestPage/TestPage';
import PostUploadPage from '../../pages/postPage/PostUploadPage/PostUploadPage';

const Router = () => {
  const { userToken } = useContext(AuthContextStore);

  return (
    <Routes>
      <Route path='*' element={<NotFoundpage />} />
      <Route path='/notfound' element={<NotFoundpage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/test' element={<TestPage />} />

      <Route element={<NonAuthRoute authenticated={userToken} />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/join' element={<JoinPage />} />
        <Route path='/post' element={<PostUploadPage />} />
      </Route>

      <Route element={<AuthRoute authenticated={userToken} />}></Route>
    </Routes>
  );
};

export default Router;
