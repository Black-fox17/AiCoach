import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Main from "./pages/Main";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('email'));
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = Boolean(localStorage.getItem('email'));
      setIsAuthenticated(auth);
    };

    checkAuth();
    // Listen for storage changes in case user logs out in another tab
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/main" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/main" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/main" /> : <Signup />} />

        {/* Protected routes */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;