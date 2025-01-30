import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CalenderModal from "../components/CalenderModal";
import { getDates, DeleteDate } from "../Services/dateService";
import { getMostVotedIdea } from "../Services/ideaService";
import { CgClose } from "react-icons/cg";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChangeContext } from "../context/ChangeContext";

function Home() {
	const { userData, isAuthenticated, setHomeTime } = useContext(AuthContext);
	const { changed, change } = useContext(ChangeContext);
	const [userDates, setUserDates] = useState([]);
	const [ideas, setIdeas] = useState({});
	const [showCalender, setShowCalender] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [action, setAction] = useState(() => {});
	const [message, setMessage] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (userData._id) {
			getDates(userData._id)
				.then((res) => {
					if (res.data.length > 0) {
						setHomeTime(res.data);
						setUserDates(res.data);

						res.data.forEach((date) => {
							getMostVotedIdea(date)
								.then((ideaRes) => {
									setIdeas((prev) => ({
										...prev,
										[date]: ideaRes.data,
									}));
								})
								.catch((err) => {
									console.log(err.response?.data);
								});
						});
					}
				})
				.catch((err) => toast.error(err.response?.data));
		}
	}, [userData, changed, setHomeTime]);

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
		DeleteDate(userData._id, date.originalDate)
			.then((res) => {
				toast.success("Date Removed");
				setUserDates(
					userDates.filter(
						(dateItem) => dateItem.originalDate !== date.originalDate
					)
				);
				setHomeTime(userDates);
				change();
			})
			.catch((err) => toast.error(err.response?.data));
	};

	if (!isAuthenticated) {
		navigate("/login");
	}

	return (
		<div
			className="container d-flex flex-column align-items-center"
			style={{ height: "100vh", marginTop: "10vh", gap: "5vh" }}
		>
			{isAuthenticated ? (
				<>
					<div
						className="text-center p-3"
						style={{
							backgroundColor: "var(--color-surface)",
							borderRadius: "10px",
							color: " var(--color-primary)",
							boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
						}}
					>
						<h3>So Glad Your Home, {userData.name?.first}</h3>
					</div>
					<div className="row g-3 w-100">
						{userDates.map((date, index) => {
							const { weekday, dayMonth, originalDate } = formatDate(date);
							const idea = ideas[originalDate];

							return (
								<div className="col-6" key={index}>
									<div
										className="card date-card border-0 shadow-sm"
										style={{
											backgroundColor: "var(--color-surface)",
											color: "var(--color-text)",
										}}
										onClick={() => navigate("/" + originalDate)}
									>
										<div className="card-body text-center">
											<h5 className="card-title">{weekday}</h5>
											<p className="card-text mb-4">{dayMonth}</p>

											{idea ? (
												<div className="mb-3">
													<h6 className="text-primary">Most Voted Idea</h6>
													<img
														src={`${process.env.REACT_APP_API_URL}${idea.profileImage.path}`}
														alt={idea.profileImage.alt}
														className="rounded-circle mb-3"
														style={{
															width: "50px",
															height: "50px",
															objectFit: "cover",
														}}
													/>
													<p>{idea.content}</p>
												</div>
											) : (
												<p>No Ideas, Yet.</p>
											)}

											<div className="d-flex flex-row align-items-center justify-content-end">
												<button
													className="btn btn-danger btn-sm"
													onClick={() => {
														setMessage([
															"Remove Date",
															"Unavailable On This Day? Remove it",
														]);
														setAction(() => () => handleRemove(date));
														setShowConfirm(true);
													}}
												>
													<CgClose size={14} />
												</button>
											</div>
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
				</>
			) : (
				<>
					<div className="text-center">
						<button
							className="btn btn-primary btn-lg mb-3 w-75"
							onClick={() => {
								sessionStorage.setItem("browsing", false);
								setShowCalender(true);
							}}
						>
							I am Home
						</button>
						<button
							className="btn btn-outline-light btn-lg w-75"
							onClick={() => {
								sessionStorage.setItem("browsing", true);
								setShowCalender(true);
							}}
						>
							Just Browsing
						</button>
					</div>
					<CalenderModal
						setIsHome={setHomeTime}
						showModal={showCalender}
						setShowModal={setShowCalender}
					/>
				</>
			)}
		</div>
	);
}

export default Home;
