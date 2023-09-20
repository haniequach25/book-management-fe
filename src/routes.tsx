import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { TenantRoutes } from './routes/tenant/tenantRoutes';
import React from 'react';
const SampleComponent = React.lazy(() => import('./components/SampleComponent'));

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<TenantRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="sample-components" element={<SampleComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
