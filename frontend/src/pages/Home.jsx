import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CalenderModal from "../components/CalenderModal";
import { getDates, deleteDate } from "../Services/dateService";
import { getMostVotedIdea } from "../Services/ideaService";
import { CgClose } from "react-icons/cg";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChangeContext } from "../context/ChangeContext";
import { updateUser } from "../Services/userService";
import ImageModal from "../components/ImageModal";

function Home() {
	const { userData, isAuthenticated } = useContext(AuthContext);
	const { changed, change } = useContext(ChangeContext);
	const [userDates, setUserDates] = useState([]);
	const [ideas, setIdeas] = useState({});
	const [showCalender, setShowCalender] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [action, setAction] = useState(() => {});
	const [message, setMessage] = useState([]);
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
			}
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if (isAuthenticated) {
			getDates(userData._id)
				.then((res) => {
					if (res.data.length > 0) {
						setUserDates(res.data);

						res.data.forEach((date) => {
							getMostVotedIdea(date)
								.then((ideaRes) => {
									setIdeas((prev) => ({
										...prev,
										[date]: ideaRes.data,
									}));
								})
								.catch((err) => console.log(err.response?.data));
						});
					}
				})
				.catch((err) => toast.error(err.response?.data));
		}
	}, [isAuthenticated, userData._id, changed]);

	const formatDate = (isoString) => {
		const date = new Date(isoString);
		return {
			originalDate: isoString,
			weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
			dayMonth: date.toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
			}),
		};
	};

	const handleRemove = async (date) => {
		try {
			await deleteDate(userData._id, date);
			toast.success("Date Removed");
			setUserDates(
				userDates.filter((dateItem) => dateItem.originalDate !== date)
			);
			change();
			if (userDates.length === 1) {
				setUserDates([]);
				handleIsHome(false);
			}
		} catch (err) {
			toast.error(err.response?.data);
		}
	};

	const handleIsHome = (isHome) => {
		updateUser(userData._id, { isHome: isHome })
			.then((res) => change())
			.catch((err) => toast.error(err.response?.data));
	};

	const handleImageClick = (imagePath, e) => {
		e.stopPropagation();
		setSelectedImageUrl(`${process.env.REACT_APP_API_URL}${imagePath}`);
		setShowImageModal(true);
	};
	return (
		<div
			className="container d-flex flex-column align-items-center"
			style={{ height: "100vh", marginTop: "10vh", gap: "5vh" }}
		>
			{isAuthenticated && userDates.length > 0 ? (
				<>
					<div
						className="text-center p-3"
						style={{
							backgroundColor: "var(--color-surface)",
							borderRadius: "10px",
							color: "var(--color-primary)",
							boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
						}}
					>
						<h3>
							{userData.isHome
								? `So Glad You're Home, ${userData.name?.first}`
								: `Welcome, ${userData.name?.first}`}
						</h3>
						{!userData.isHome && (
							<p className="text-warning mt-2">
								You are in browsing mode. Switch to "I am Home" to interact with
								ideas.
							</p>
						)}
					</div>
					<div className="row g-3 w-100">
						{userDates.map((date, index) => {
							const { weekday, dayMonth, originalDate } = formatDate(date);
							const idea = ideas[originalDate];

							return (
								<div className="col-6" key={index}>
									<div
										className="card date-card"
										style={{
											backgroundColor: "var(--color-surface)",
											color: "var(--color-text)",
											cursor: "pointer",
										}}
										onClick={() => {
											navigate("/ideas/" + originalDate);
										}}
									>
										<div className="card-body text-center">
											<h5 className="card-title">{weekday}</h5>
											<p className="card-text mb-4">{dayMonth}</p>

											{idea ? (
												<div className="mb-3">
													<h6 className="text-primary">Most Voted Idea</h6>
													<div className="d-flex flex-row align-items-center justify-content-center">
														<img
															src={`${process.env.REACT_APP_API_URL}${idea.profileImage.path}`}
															alt={idea.profileImage.alt}
															className="rounded-circle "
															style={{
																width: "30px",
																height: "30px",
																objectFit: "cover",
																cursor: "pointer",
															}}
															onClick={(e) =>
																handleImageClick(idea.profileImage.path, e)
															}
														/>
														<p className="m-2">: {idea.content}</p>
													</div>
												</div>
											) : (
												<p>No Ideas, Yet.</p>
											)}

											{userData.isHome && (
												<div className="d-flex flex-row align-items-center justify-content-end">
													<button
														className="btn btn-danger btn-sm"
														onClick={(e) => {
															e.stopPropagation();
															setMessage([
																"Remove Date",
																"Unavailable On This Day? Remove it",
															]);
															setAction(() => () => handleRemove(originalDate));
															setShowConfirm(true);
														}}
													>
														<CgClose size={14} />
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<ConfirmModal
						isOpen={showConfirm}
						onClose={() => setShowConfirm(false)}
						action={action}
						title={message[0]}
						message={message[1]}
					/>
					<ImageModal
						show={showImageModal}
						onHide={() => setShowImageModal(false)}
						imageUrl={selectedImageUrl}
					/>
				</>
			) : (
				<>
					<div className="text-center">
						<button
							className="btn btn-primary btn-lg mb-3 w-75"
							onClick={() => {
								handleIsHome(true);
								setShowCalender(true);
							}}
						>
							I am Home
						</button>
						<button
							className="btn btn-outline-light btn-lg w-75"
							onClick={() => {
								handleIsHome(false);
								setShowCalender(true);
							}}
						>
							Just Browsing
						</button>
					</div>
					<CalenderModal
						showModal={showCalender}
						setShowModal={setShowCalender}
					/>
				</>
			)}
		</div>
	);
}

export default Home;
