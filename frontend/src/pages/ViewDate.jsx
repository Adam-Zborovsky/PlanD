import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { deleteIdea, getIdeas, voteForIdea } from "../Services/ideaService";
import { useParams } from "react-router-dom";
import { TiPlus } from "react-icons/ti";
import { AiFillLike, AiFillEdit } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import IdeaModal from "../components/IdeaModal";
import { AuthContext } from "../context/AuthContext";
import { ChangeContext } from "../context/ChangeContext";
import ConfirmModal from "../components/ConfirmModal";

function ViewDate() {
	const { changed, change } = useContext(ChangeContext);
	const { userData } = useContext(AuthContext);
	const [ideas, setIdeas] = useState([]);
	const [showIdeaModal, setShowIdeaModal] = useState(false);
	const [initialIdea, setInitialIdea] = useState({});
	const [showConfirm, setShowConfirm] = useState(false);
	const [action, setAction] = useState(() => {});
	const [message, setMessage] = useState([]);
	const { date } = useParams();

	useEffect(() => {
		getIdeas(date)
			.then((res) => {
				setIdeas(res.data);
			})
			.catch((err) => toast.error(err.response.data));
	}, [date, changed]);

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

	const formattedDate = formatDate(date);

	const handleVote = (ideaId) => {
		voteForIdea(ideaId)
			.then((res) => {
				console.log(res.data);
				change();
			})
			.catch((err) => toast.error(err.response.data));
	};

	const handleDelete = (ideaId) => {
		deleteIdea(ideaId)
			.then((res) => {
				console.log(res.data);
				change();
			})
			.catch((err) => toast.error(err.response.data));
	};

	return (
		<>
			<div
				className="container d-flex flex-column align-items-center"
				style={{ height: "100vh", marginTop: "10vh", gap: "5vh" }}
			>
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
						{formattedDate.weekday} {formattedDate.dayMonth}
					</h3>
				</div>

				<div className="w-100">
					<div className="d-flex flex-wrap justify-content-center gap-3">
						{ideas.map((idea, index) => (
							<div
								key={index}
								className="card  d-flex flex-column align-items-center p-3"
								style={{
									backgroundColor: "var(--color-surface)",
									color: "var(--color-text)",
									borderRadius: "10px",
									boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
									maxWidth: "75vw",
								}}
							>
								<h5 className="card-title">{idea.content}</h5>
								<p className="card-text mb-4">{idea.image}</p>
								<div className="d-flex gap-5">
									<button
										className="btn btn-outline-primary"
										style={{
											borderRadius: "10px",
											width: "50px",
											height: "45px",
										}}
										onClick={() => handleVote(idea._id)}
									>
										{idea.votes.includes(userData._id) ? (
											<AiFillLike
												size={20}
												style={{ transform: "rotate(180deg)" }}
											/>
										) : (
											<AiFillLike size={20} />
										)}
									</button>
									{userData._id === idea.ownerId && (
										<>
											<button
												className="btn btn-outline-primary"
												style={{
													borderRadius: "10px",
													width: "50px",
													height: "45px",
												}}
												onClick={() => {
													setInitialIdea(idea);
													setShowIdeaModal(true);
												}}
											>
												<AiFillEdit size={20} />
											</button>
											<button
												className="btn btn-outline-danger"
												style={{
													borderRadius: "10px",
													width: "50px",
													height: "45px",
												}}
												onClick={() => {
													setShowConfirm(true);
													setAction(() => () => handleDelete(idea._id));
													setMessage([
														"Delete Idea",
														"Are you sure you want to delete this idea?",
													]);
												}}
											>
												<FaTrash size={20} />
											</button>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
				<div>
					<button
						className="btn btn-outline-primary"
						style={{ borderRadius: "10px" }}
						onClick={() => {
							setInitialIdea({ content: "" });
							setShowIdeaModal(true);
						}}
					>
						<TiPlus size={25} />
					</button>
				</div>
			</div>
			<IdeaModal
				showModal={showIdeaModal}
				setShowModal={setShowIdeaModal}
				initialIdea={initialIdea}
			/>
			<ConfirmModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				action={action}
				title={message[0]}
				message={message[1]}
			/>
		</>
	);
}

export default ViewDate;
