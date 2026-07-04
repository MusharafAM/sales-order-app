import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SalesOrderPage from './pages/SalesOrderPage';

export default function App() {
  return (
    <Routes>
      {/* Home is the first screen that opens when the app runs */}
      <Route path="/" element={<HomePage />} />
      <Route path="/orders/new" element={<SalesOrderPage />} />
      <Route path="/orders/:id" element={<SalesOrderPage />} />
    </Routes>
  );
}
