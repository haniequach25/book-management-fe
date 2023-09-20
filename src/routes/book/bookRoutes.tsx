import { Spin } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Book = lazy(() => import('.'));
const BookList = lazy(() => import('./list'));

const BookRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Suspense fallback={<Spin />}>
            <Book />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Spin />}>
              <BookList />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default BookRoutes;
