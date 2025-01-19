import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import CalenderModal from "../components/CalenderModal";

function Home() {
	const { isAuthenticated } = useContext(AuthContext);
	const [isHome, setIsHome] = useState(false);
	const [showModal, setShowModal] = useState(false);

	if (!isAuthenticated) {
		return <Login />;
	}

	const handleComingHome = () => {
		setShowModal(true);
		localStorage.setItem("isBrowsing", false);
	};
	const handleJustBrowsing = () => {
		setShowModal(true);
		localStorage.setItem("isBrowsing", true);
	};

	return (
		<div
			className="d-flex justify-content-center align-items-center"
			style={{
				height: "100vh",
				marginTop: "-15vh",
				gap: "25px",
				flexDirection: "column",
			}}
		>
			{!isHome ? (
				<>
					<button
						className="btn btn-primary btn-lg"
						style={{ fontSize: "1.5rem" }}
						onClick={handleComingHome}
					>
						I am Coming Home
					</button>
					<button
						className="btn btn-secondary btn-lg"
						style={{ fontSize: "0.8rem" }}
						onClick={handleJustBrowsing}
					>
						Just Browsing
					</button>
				</>
			) : (
				<></>
			)}
			<CalenderModal
				setIsHome={setIsHome}
				showModal={showModal}
				setShowModal={setShowModal}
			/>
		</div>
	);
}

export default Home;
