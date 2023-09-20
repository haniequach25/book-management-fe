import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Admin = React.lazy(() => import('./index'));
const ListCustomer = React.lazy(() => import('./customer/ListCustomer'));
const ListRole = React.lazy(() => import('./role/ListRole'));
const CreateRole = React.lazy(() => import('./role/CreateEditRole'));
const SignInAdmin = React.lazy(() => import('./auth/SignInAdmin'));

export const AdminRoutes = () => (
  <Routes>
    <Route path="signin" element={<SignInAdmin />} />
    <Route path="" element={<Admin />}>
      <Route path="customers" element={<ListCustomer />} />
      <Route path="roles">
        <Route path="" element={<ListRole />} />
        <Route path="create" element={<CreateRole />} />
        <Route path="detail/:id" element={<CreateRole />} />
      </Route>
    </Route>
  </Routes>
);
