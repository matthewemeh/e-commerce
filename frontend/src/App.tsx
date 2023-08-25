import { useEffect } from 'react';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';

import Dashboard from './pages/admin/Dashboard';
import NewProduct from './pages/admin/NewProduct';
import EditProduct from './pages/admin/EditProduct';

import { addNotification } from './features/userSlice';
import { GlobalState, Notification, User } from './interfaces';

const App = () => {
  const user: User | null = useSelector((state: GlobalState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    const socket = io('ws://localhost:8080');
    socket.off('notification').on('notification', (notification: Notification, userID: string) => {
      /* send notification of shipped order to user/client */
      if (userID === user._id) {
        dispatch(addNotification(notification));
      }
    });

    socket.off('new-order').on('new-order', (notification: Notification) => {
      /* send notification of new order to admin */
      if (user.isAdmin) {
        dispatch(addNotification(notification));
      }
    });
  }, [user]);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route index element={<Home />} />
        {user ? (
          <>
            <Route path='/cart' element={<CartPage />} />
            <Route path='/orders' element={<OrderPage />} />
          </>
        ) : (
          <>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </>
        )}
        {user && user.isAdmin && (
          <>
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/product/:id/edit' element={<EditProduct />} />
          </>
        )}
        <Route path='/new-product' element={<NewProduct />} />
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/category/:category' element={<CategoryPage />} />
        <Route path='*' element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
