import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { ChangeContext } from "./ChangeContext";
import { getToken } from "../Services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const { changed } = useContext(ChangeContext);
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
			setUserData(jwtDecode(token));
		} else {
			setIsAuthenticated(false);
			setUserData({});
		}
	}, []);
	useEffect(() => {
		if (userData._id) {
			getToken(userData._id)
				.then((res) => {
					localStorage.setItem("token", res.data);
					setUserData(jwtDecode(res.data));
				})
				.catch((err) => console.log(err));
		}
	}, [changed, userData._id]);

	const login = (token) => {
		localStorage.setItem("token", token);
		setUserData(jwtDecode(token));
		setIsAuthenticated(true);
		toast.success("Log in successfully");
	};

	const logout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		setUserData({});
		toast.success("Log out successfully");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
