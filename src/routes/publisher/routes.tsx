import { Spin } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Publisher = lazy(() => import('.'));
const PublisherList = lazy(() => import('./List'));

const PublisherRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Suspense fallback={<Spin />}>
            <Publisher />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Spin />}>
              <PublisherList />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default PublisherRoutes;
