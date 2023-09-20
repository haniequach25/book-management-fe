import { Spin } from 'antd';
import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const Book = lazy(() => import('.'));
const BookList = lazy(() => import('./list'));

const BookRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      navigate('/book');
    }
  }, []);

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
