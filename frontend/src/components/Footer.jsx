import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaHome, FaUser, FaUsers, FaUserShield } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
	const { isAuthenticated, userData } = useContext(AuthContext);

	return (
		<footer className="footer fixed-bottom ">
			<div
				className="d-flex flex-row justify-content-around align-items-center"
				style={{ minHeight: "50px", maxWidth: "500px", margin: "auto" }}
			>
				<div>
					<Link to="/" className="footer-link">
						<FaHome size={25} color="var(--color-primary)" />
					</Link>
				</div>

				{isAuthenticated && (
					<div>
						<Link to="/profile" className="footer-link">
							<FaUser size={23} color="var(--color-primary)" />
						</Link>
					</div>
				)}

				{isAuthenticated && (
					<div>
						<Link to="/all-friends" className="footer-link ">
							<FaUsers size={28} color="var(--color-primary)" />
						</Link>
					</div>
				)}

				{userData?.isAdmin && (
					<div>
						<Link to="/admin" className="footer-link">
							<FaUserShield size={25} color="var(--color-primary)" />
						</Link>
					</div>
				)}
			</div>
		</footer>
	);
}

export default Footer;
