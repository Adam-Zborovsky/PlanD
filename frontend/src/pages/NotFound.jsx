import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div className="container d-flex flex-column align-items-center">
			<h1>404 - Page Not Found</h1>
			<Link to="/">Go to Home</Link>
		</div>
	);
}
export default NotFound;
