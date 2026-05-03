import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Portal from "./pages/Portal";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import GlobalCartBar from "./components/GlobalCartBar";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <GlobalCartBar />
        <Routes>

          <Route
            path="/"
            element={<Portal />}
          />

          <Route
            path="/login/:role"
            element={<Login />}
          />

          {/* Student Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRole="student">
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurant/:id"
            element={
              <ProtectedRoute allowedRole="student">
                <Restaurant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRole="student">
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/track/:id"
            element={
              <ProtectedRoute allowedRole="student">
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          {/* Kitchen Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="kitchen">
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;