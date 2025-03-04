import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Auth0Provider } from "@auth0/auth0-react";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Checkout,
  PageNotFound,
} from "./pages";

import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes"; // ✅ Import Protected Route

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-qffh1n388evg38vb.us.auth0.com"
    clientId="ynxXUG3efOIjTQPjs4UuoNse6dB99bTk"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <BrowserRouter>
      <ScrollToTop>
        <Provider store={store}>
          <Routes>
            {/* ✅ Public Route (Home) */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />

            {/* ✅ Protected Routes (Require Authentication) */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/product" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* ✅ Catch-all Route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Provider>
      </ScrollToTop>
      <Toaster />
    </BrowserRouter>
  </Auth0Provider>
);
