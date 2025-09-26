import { ChakraProvider, extendTheme, Spinner, Center } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Menu from "./pages/Menu";

const theme = extendTheme({
  colors: { brand: { 500: "#1a73e8" } },
  fonts: {
    heading: "Roboto, sans-serif",
    body: "Roboto, sans-serif",
  },
});

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
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </PageWrapper>
      </BrowserRouter>
    </ChakraProvider>
  );
}
