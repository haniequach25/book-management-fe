import { Spin } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Author = lazy(() => import('.'));
const AuthorList = lazy(() => import('./List'));

const AuthorRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Suspense fallback={<Spin />}>
            <Author />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Spin />}>
              <AuthorList />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AuthorRoutes;
