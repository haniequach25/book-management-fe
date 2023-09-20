import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BookRoutes from './routes/book/bookRoutes';

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<BookRoutes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesApp;
