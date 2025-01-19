import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.js";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import NavBar from "./components/Navbar.jsx";

function App() {
	return (
		<AuthProvider>
			<Router>
				<NavBar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/register" element={<Register />} />
					<Route path="*" />
				</Routes>
				{/* <Footer /> */}
			</Router>
		</AuthProvider>
	);
}

export default App;
