import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Customer = React.lazy(() => import('.'));
const SignInCustomer = React.lazy(() => import('./auth/SignInTenant'));
export const TenantRoutes = () => (
  <Routes>
    <Route path="/signin" element={<SignInCustomer />} />
    <Route path="" element={<Customer />} />
  </Routes>
);
