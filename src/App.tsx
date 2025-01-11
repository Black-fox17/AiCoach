import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Navigate} from "react-router-dom"
import Home from "./pages/Home.tsx"
import Login from "./pages/login.tsx"
import Signup from "./pages/signup.tsx";
import Main from "./pages/Main.tsx";

interface PrivateRouteProps {
    children: JSX.Element;
  }
  
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = Boolean(localStorage.getItem('email')); // Replace with actual auth logic
  
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element= {<Home />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup/>} />
                <Route
                    path="/main"
                    element={
                        <PrivateRoute>
                         <Main />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    )
};
export default App;