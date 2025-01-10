import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx"
import Login from "./pages/login.tsx"
import Signup from "./pages/signup.tsx";
import Main from "./pages/Main.tsx";

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element= {<Home />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup/>} />
                <Route path="/main" element= {<Main/>} />
            </Routes>
        </Router>
    )
};
export default App;