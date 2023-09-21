import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import BookRoutes from './routes/book/routes';
import { useEffect } from 'react';
import AuthorRoutes from './routes/author/routes';
import CategoryRoutes from './routes/category/routes';
import PublisherRoutes from './routes/publisher/routes';
import OrderRoutes from './routes/order/routes';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      navigate('/book');
    }
  }, []);

  return <></>;
};

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book/*" element={<BookRoutes />} />
        <Route path="/author/*" element={<AuthorRoutes />} />
        <Route path="/category/*" element={<CategoryRoutes />} />
        <Route path="/publisher/*" element={<PublisherRoutes />} />
        <Route path="/order/*" element={<OrderRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
