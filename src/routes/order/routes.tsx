import { Spin } from 'antd';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Order = lazy(() => import('.'));
const OrderList = lazy(() => import('./List'));

const OrderRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Suspense fallback={<Spin />}>
            <Order />
          </Suspense>
        }
      >
        <Route
          path=""
          element={
            <Suspense fallback={<Spin />}>
              <OrderList />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default OrderRoutes;
