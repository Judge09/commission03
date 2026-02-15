import { ChakraProvider, Spinner, Center } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import theme from "./theme";

// Loading wrapper for transitions
function PageWrapper({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400); // 👈 small delay (400ms)
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return children;
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <Menu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </PageWrapper>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
