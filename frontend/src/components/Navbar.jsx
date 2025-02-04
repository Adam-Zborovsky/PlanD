import { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
	const { logout, isAuthenticated, userData } = useContext(AuthContext);
	const [isOpen, setIsOpen] = useState(false);

	const toggleNav = () => {
		setIsOpen(!isOpen);
	};
	return (
		<>
			<div className="navbar">
				<button className="menu-button" onClick={toggleNav}>
					<FaBars color="var(--color-text)" size={24} />
				</button>
			</div>
			<div className={`side-nav ${isOpen ? "open" : ""}`}>
				<button className="close-button" onClick={toggleNav}>
					<IoClose color="var(--color-text)" size={24} />
				</button>
				<ul className="nav-links">
					<li className="nav-item">
						<Link className="nav-link" to="/" onClick={() => toggleNav()}>
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link
							className="nav-link"
							to="/profile"
							onClick={() => toggleNav()}
						>
							Profile
						</Link>
					</li>

					<li className="nav-item">
						<Link
							className="nav-link"
							to="/all-friends"
							onClick={() => toggleNav()}
						>
							All Friends
						</Link>
					</li>

					{userData.isAdmin && (
						<li className="nav-item">
							<Link
								className="nav-link"
								to="/admin"
								onClick={() => toggleNav()}
							>
								Admin
							</Link>
						</li>
					)}
					{isAuthenticated && (
						<li className="nav-item">
							<button
								className="nav-link"
								onClick={() => {
									toggleNav();
									logout();
									window.location.reload();
								}}
							>
								Logout
							</button>
						</li>
					)}
				</ul>
				<div className="social-links">
					<span>Facebook</span>
					<span>Instagram</span>
					<span>Twitter</span>
				</div>
			</div>
			{isOpen && <div className="overlay" onClick={toggleNav}></div>}
		</>
	);
};

export default NavBar;
