import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from 'react-hot-toast';

// Auth Components
import { AuthSync } from './components/auth/AuthSync';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminLayout } from './components/layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Statistics } from './pages/admin/Statistics';
import { CustomerManagement } from './pages/admin/CustomerManagement';
import { VehicleManagement } from './pages/admin/VehicleManagement';
import { ServiceManagement } from './pages/admin/ServiceManagement';
import { ProductManagement } from './pages/admin/ProductManagement';
import { InvoiceManagement } from './pages/admin/InvoiceManagement';
import { RequestManagement } from './pages/admin/RequestManagement';
import { ContactManagement } from './pages/admin/ContactManagement';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Customer Pages
import { PublicLayout } from './components/layouts/PublicLayout';
import { CustomerHomePage } from './pages/customer/CustomerHomePage';
import { ServicesPage } from './pages/customer/ServicesPage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { ContactPage } from './pages/customer/ContactPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { ServiceRequestsPage } from './pages/customer/ServiceRequestsPage';
import ServiceBookingPage from './pages/customer/ServiceBookingPage';

// Error Pages
import { NotFoundPage } from './pages/error/NotFoundPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthSync />
        <div className="App">
          <Routes>
            {/* Default route - redirect to login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />

            {/* Auth Routes */}
            <Route
              path="/auth/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/auth/logout"
              element={<Navigate to="/auth/login" replace />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="services" element={<ServiceManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="invoices" element={<InvoiceManagement />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="contacts" element={<ContactManagement />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Customer Routes */}
            <Route path="/customer/*" element={<PublicLayout />}>
              <Route index element={<CustomerHomePage />} />
              <Route path="home" element={<CustomerHomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route
                path="services/:id/book"
                element={<ServiceBookingPage />}
              />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="contact" element={<ContactPage />} />

              {/* Protected Customer Routes */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute requiredRole="Customer">
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute requiredRole="Customer">
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="service-requests"
                element={
                  <ProtectedRoute requiredRole="Customer">
                    <ServiceRequestsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Public Routes (without layout) */}
            <Route path="/services" element={<PublicLayout />}>
              <Route index element={<ServicesPage />} />
            </Route>
            <Route path="/products" element={<PublicLayout />}>
              <Route index element={<ProductsPage />} />
            </Route>
            <Route path="/contact" element={<PublicLayout />}>
              <Route index element={<ContactPage />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
