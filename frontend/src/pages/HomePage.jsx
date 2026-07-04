import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/ordersSlice';
import OrdersGrid from '../components/OrdersGrid';

// Screen 2 (Home): the first screen that opens when the app runs.
export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, listStatus, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl rounded-lg border border-gray-300 bg-white shadow">
        <div className="border-b border-gray-300 bg-gray-50 px-4 py-3 text-center font-semibold text-gray-700">
          Home
        </div>

        <div className="border-b border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/orders/new')}
            className="rounded border border-gray-400 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Add New
          </button>
        </div>

        <div className="p-4">
          {listStatus === 'loading' && (
            <p className="text-sm text-gray-500">Loading orders...</p>
          )}
          {listStatus === 'failed' && (
            <p className="text-sm text-red-600">
              Could not load orders: {error}. Make sure the API is running.
            </p>
          )}
          {listStatus === 'succeeded' && (
            <OrdersGrid
              orders={list}
              onRowDoubleClick={(order) => navigate(`/orders/${order.id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
