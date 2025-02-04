import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext.js";
import { ChangeProvider } from "./context/ChangeContext.js";
import { Bounce, ToastContainer } from "react-toastify";
import NavBar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ViewDate from "./pages/ViewDate.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
	return (
		<ChangeProvider>
			<AuthProvider>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
					transition={Bounce}
				/>
				<Router>
					<NavBar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/ideas/:date" element={<ViewDate />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Router>
			</AuthProvider>
		</ChangeProvider>
	);
}

export default App;
