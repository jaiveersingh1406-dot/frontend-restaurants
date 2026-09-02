import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import Hero from '../pages/Hero';
import About from '../pages/About';
import Menu from '../pages/Menu';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Reservation from '../pages/Reservation';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import AdminLoginPage from '../pages/AdminLogin';
import ForgotPassword from '../components/ForgotPassword';

import AdminDashboard from '../pages/AdminDashboard';
import AdminLayout from '../pages/AdminLayout';
import AdminReservations from '../pages/AdminReservations';
import AdminProducts from '../pages/AdminProducts';
import AdminMenu from '../pages/AdminMenu';
import AdminAccounting from '../pages/AdminAccounting';
import AdminOrders from '../pages/AdminOrders';
import AdminDatabase from '../pages/AdminDatabase';
import AdminMessages from '../pages/AdminMessages';
import EditProduct from '../pages/EditProduct';

import Layout from '../layout/layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hero" element={<Hero />} />
          <Route path="about" element={<About />} />
          <Route path="menu" element={<Menu />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="menu/edit/:id" element={<EditProduct />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="accounting" element={<AdminAccounting />} />
          <Route path="database" element={<AdminDatabase />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        <Route path="admin/login" element={<AdminLoginPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
