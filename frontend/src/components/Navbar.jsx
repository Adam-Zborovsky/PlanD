import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const NavBar = () => {
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
					<li>
						<Link to="/" />
						Home
					</li>
					<li>
						<Link to="/profile" />
						Profile
					</li>
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
