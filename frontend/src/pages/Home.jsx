import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";
import CalenderModal from "../components/CalenderModal";
import { getDates, DeleteDate } from "../Services/dateService";
import { getMostVotedIdea } from "../Services/ideaService";
import { CgClose } from "react-icons/cg";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";



function Home() {
	const { userData, isAuthenticated } = useContext(AuthContext);
	const [isHome, setIsHome] = useState(false);
	const [userDates, setUserDates] = useState([]);
	const [ideas, setIdeas] = useState({});
	const [showCalender, setShowCalender] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [action, setAction] = useState(() => { });
	const [message, setMessage] = useState([]);
	const navigate = useNavigate();
	const location = useLocation();

	const fetchData = async () => {
		try {
			const res = await getDates(userData._id);
			if (res.data.length > 0) {
				setIsHome(true);
				const formattedDates = res.data.map((date) => formatDate(date));
				setUserDates(formattedDates);

				formattedDates.forEach(({ originalDate }) => {
					getMostVotedIdea(originalDate)
						.then((ideaRes) => {
							setIdeas((prev) => ({
								...prev,
								[originalDate]: ideaRes.data.idea,
							}));
						})
						.catch((err) => {
							if (err.response?.status !== 404) {
								toast.error(err.response?.data);
							}
						});
				});
			}
		} catch (err) {
			toast.error(err.response?.data);
		}
	};

	useEffect(() => {
		fetchData();
	}, [userData, location]);

	const formatDate = (isoString) => {
		const date = new Date(isoString);
		return {
			originalDate: isoString,
			weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
			dayMonth: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
		};
	};

	const handleRemove = async (date) => {
		try {
			await DeleteDate(userData._id, date.originalDate);
			toast.success("Date Removed");
			setUserDates(userDates.filter((dateItem) => dateItem.originalDate !== date.originalDate));
			if (userDates.length === 1) {
				fetchData(); // Re-fetch if it was the last date
			}
		} catch (err) {
			toast.error(err.response?.data);
		}
	};



	if (!isAuthenticated) {
		return <Login />;
	}

	return (
		<div className="container d-flex flex-column align-items-center" style={{ height: "100vh", marginTop: "10vh", gap: "5vh" }}>
			{isHome || sessionStorage.getItem("browsing",)
				? (
					<>
						<div className="text-center p-3" style={{ backgroundColor: "var(--color-surface)", borderRadius: "10px", color: " var(--color-primary)", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)" }}>
							<h3>So Glad Your Home, {userData.name.first}
							</h3>
						</div>
						<div className="row g-3 w-100">
							{userDates.map((date, index) => {
								const { weekday, dayMonth, originalDate } = date;
								const idea = ideas[originalDate];

								return (
									<div className="col-6" key={index}>
										<div className="card date-card border-0 shadow-sm" style={{
											backgroundColor: "var(--color-surface)",
											color: "var(--color-text)"
										}}
											onClick={() => navigate("/" + originalDate)}>
											<div className="card-body text-center">
												<h5 className="card-title">{weekday}</h5>
												<p className="card-text mb-4">{dayMonth}</p>

												{idea ? (
													<div className="mb-3">
														<h6 className="text-primary">Most Voted Idea</h6>
														<p>{idea.title}</p>
													</div>
												) : (
													<p>No Ideas, Yet.</p>
												)}

												<div className="d-flex flex-row align-items-center justify-content-end">
													<button className="btn btn-danger btn-sm" onClick={() => {
														setMessage(["Remove Date", "Unavailable On This Day? Remove it"]);
														setAction(() => () => handleRemove(date));
														setShowConfirm(true);
													}}>
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
									sessionStorage.setItem("browsing", false)
									setShowCalender(true)
								}}
							>
								I am Home
							</button>
							<button
								className="btn btn-outline-light btn-lg w-75"
								onClick={() => {
									sessionStorage.setItem("browsing", false);
									setShowCalender(true)
								}}
							>
								Just Browsing
							</button>
						</div>
						<CalenderModal
							setIsHome={setIsHome}
							showModal={showCalender}
							setShowModal={setShowCalender}
						/>
					</>
				)
			}
		</div >
	);
}

export default Home;
