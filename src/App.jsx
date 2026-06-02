import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.js";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import ScrollToTop from '@/components/ScrollToTop';


import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

// Pages
import Home              from "./pages/Home.jsx";
import Shop              from "./pages/Shop.jsx";
import ProductDetail     from "./pages/ProductDetail.jsx";
import Cart              from "./pages/Cart.jsx";
import Checkout          from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import PaymentCallback   from "./pages/PaymentCallback.jsx";
import About             from "./pages/About.jsx";
import Contact           from "./pages/Contact.jsx";
import TrackOrder        from "./pages/TrackOrder.jsx";
import Privacy           from "./pages/Privacy.jsx";
import Disclaimer        from "./pages/Disclaimer.jsx";
import Wishlist          from "./pages/Wishlist.jsx";
import SignIn            from "./pages/SignIn.jsx";
import Register          from "./pages/Register.jsx";
import Affiliate         from "./pages/Affiliate.jsx";
import AffiliateDashboard from "./pages/AffiliateDashboard.jsx";

// Admin
import Admin             from "./pages/Admin.jsx";
import AdminOrders       from "./pages/AdminOrders.jsx";
import AdminProducts     from "./pages/AdminProducts.jsx";
import AdminUpload       from "./pages/AdminUpload.jsx";
import AdminCustomers    from "./pages/AdminCustomers.jsx";
import AdminAffiliates   from "./pages/AdminAffiliates.jsx";

import PageNotFound from "./lib/PageNotFound.jsx";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
                    <ScrollToTop /> 
              <Routes>

                {/* OAuth callback — no layout */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Public routes with Layout */}
                <Route element={<Layout />}>
                  <Route path="/"                    element={<Home />} />
                  <Route path="/shop"                element={<Shop />} />
                  <Route path="/product/:id"         element={<ProductDetail />} />
                  <Route path="/cart"                element={<Cart />} />
                  <Route path="/checkout"            element={<Checkout />} />
                  <Route path="/order-confirmation"  element={<OrderConfirmation />} />
                  <Route path="/payment/callback"    element={<PaymentCallback />} />
                  <Route path="/about"               element={<About />} />
                  <Route path="/contact"             element={<Contact />} />
                  <Route path="/track"               element={<TrackOrder />} />
                  <Route path="/privacy"             element={<Privacy />} />
                  <Route path="/disclaimer"          element={<Disclaimer />} />
                  <Route path="/wishlist"            element={<Wishlist />} />
                  <Route path="/login"               element={<SignIn />} />
                  <Route path="/register"            element={<Register />} />
                  <Route path="/affiliate"           element={<Affiliate />} />
                  <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
                </Route>

                {/* Admin routes — Admin.jsx handles its own nested Routes internally */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<PageNotFound />} />

              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}