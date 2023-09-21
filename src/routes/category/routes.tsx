import { Spin } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Category = lazy(() => import('.'));
const CategoryList = lazy(() => import('./List'));

const CategoryRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Suspense fallback={<Spin />}>
            <Category />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Spin />}>
              <CategoryList />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default CategoryRoutes;
