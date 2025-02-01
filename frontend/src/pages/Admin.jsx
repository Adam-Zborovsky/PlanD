import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { deleteUser, getAllUsers, updateUser } from "../Services/userService";
import { deleteIdea, getAllIdeas, updateIdea } from "../Services/ideaService";
import { Link } from "react-router-dom";
import ImageModal from "../components/ImageModal";

function Admin() {
	const { userData, change } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const [ideas, setIdeas] = useState([]);
	const [viewMode, setViewMode] = useState("users");
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState("");

	const [editingUserId, setEditingUserId] = useState(null);
	const [userEditForm, setUserEditForm] = useState({});

	const [editingIdeaId, setEditingIdeaId] = useState(null);
	const [ideaEditForm, setIdeaEditForm] = useState({});

	useEffect(() => {
		if (viewMode === "users") {
			getAllUsers(userData._id)
				.then((res) => setUsers(res.data))
				.catch((err) => console.log(err));
		}
	}, [userData._id, viewMode]);

	useEffect(() => {
		if (viewMode === "ideas") {
			getAllIdeas()
				.then((res) => setIdeas(res.data))
				.catch((err) => console.log(err));
		}
	}, [viewMode, change]);

	if (!userData.isAdmin) {
		return (
			<div
				className="container d-flex flex-column align-items-center"
				style={{ marginTop: "10vh" }}
			>
				<h1>Must Be Admin</h1>
				<Link to="/">Go to Home</Link>
			</div>
		);
	}

	const toggleView = () => {
		setViewMode((prev) => (prev === "users" ? "ideas" : "users"));
	};

	const handleEditUser = (user) => {
		if (!user.isAdmin) {
			setEditingUserId(user._id);
			setUserEditForm({
				first: user.name.first,
				middle: user.name.middle,
				last: user.name.last,
				email: user.email,
				dates: user.dates ? user.dates.join(", ") : "",
			});
		}
	};

	const handleDeleteUser = (user) => {
		if (!user.isAdmin) {
			deleteUser(user._id)
				.then((res) => {
					setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
					if (typeof change === "function") {
						change();
					}
				})
				.catch((err) => console.log(err));
		}
	};

	const handleUserInputChange = (e) => {
		const { name, value } = e.target;
		setUserEditForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleUserSave = (userId) => {
		if (!userEditForm.isAdmin) {
			const updatedUserData = {
				...userEditForm,
				dates: userEditForm.dates
					.split(",")
					.map((date) => date.trim())
					.filter((date) => date),
			};
			updateUser(userId, updatedUserData)
				.then((res) => {
					setUsers((prevUsers) =>
						prevUsers.map((user) => (user._id === userId ? res.data : user))
					);
					setEditingUserId(null);
					change();
				})
				.catch((err) => console.log(err));
		}
	};

	const handleEditIdea = (idea) => {
		const ideaId = idea._id;
		setEditingIdeaId(ideaId);
		setIdeaEditForm({
			date: idea.date,
			content: idea.content,
		});
	};

	const handleDeleteIdea = (ideaToDelete) => {
		deleteIdea(ideaToDelete._id)
			.then((res) => {
				setIdeas((prevIdeas) =>
					prevIdeas.filter((idea) => idea._id !== ideaToDelete._id)
				);
				change();
			})
			.catch((err) => console.log(err));
	};

	const handleIdeaInputChange = (e) => {
		const { name, value } = e.target;
		setIdeaEditForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleIdeaSave = (ideaId) => {
		updateIdea(ideaId, ideaEditForm)
			.then((res) => {
				setIdeas((prevIdeas) =>
					prevIdeas.map((idea) => (idea._id === ideaId ? res.data : idea))
				);
				setEditingIdeaId(null);
				change();
			})
			.catch((err) => console.log(err));
	};

	const handleImageClick = (imagePath) => {
		setSelectedImageUrl(`${process.env.REACT_APP_API_URL}${imagePath}`);
		setShowImageModal(true);
	};

	return (
		<div
			className="container d-flex flex-column align-items-center justify-content-center"
			style={{ marginTop: "10vh" }}
		>
			<button className="btn btn-primary mb-3" onClick={toggleView}>
				{viewMode === "users" ? "Switch to Ideas" : "Switch to Users"}
			</button>

			<div
				className="d-flex flex-column align-items-center justify-content-center"
				style={{ transition: "all 2.5s ease", transform: "translateX(0)" }}
			>
				{viewMode === "users" ? (
					<>
						<h2 className="mb-4">Manage Users</h2>
						<div className="row">
							{users.map((user) => (
								<div
									className="col-md-4 d-flex align-items-stretch"
									key={user._id}
								>
									<div
										className="card mb-3 w-100 d-flex align-items-center"
										style={{
											backgroundColor: "var(--color-surface)",
											borderRadius: "10px",
											color: "var(--color-text)",
											boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
											minWidth: "100%",
										}}
									>
										{user.image && user.image.path && (
											<img
												src={`${process.env.REACT_APP_API_URL}${user.image.path}`}
												alt={user.image.alt || "User profile"}
												className="rounded-circle mb-3 cursor-pointer"
												style={{
													width: "50px",
													height: "50px",
													objectFit: "cover",
													cursor: "pointer",
												}}
												onClick={() => handleImageClick(user.image.path)}
											/>
										)}
										<div className="card-body w-100">
											{editingUserId === user._id ? (
												<div className="w-100">
													<div className="mb-2 w-100">
														<label>First Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="first"
															value={userEditForm.first || ""}
															onChange={handleUserInputChange}
														/>
													</div>
													<div className="mb-2 w-100">
														<label>Middle Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="middle"
															value={userEditForm.middle || ""}
															onChange={handleUserInputChange}
														/>
													</div>
													<div className="mb-2 w-100">
														<label>Last Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="last"
															value={userEditForm.last || ""}
															onChange={handleUserInputChange}
														/>
													</div>
													<div className="mb-2 w-100">
														<label>Email</label>
														<input
															type="email"
															className="form-control w-100 text-center"
															name="email"
															value={userEditForm.email || ""}
															onChange={handleUserInputChange}
														/>
													</div>
													<div className="mb-2 w-100">
														<label>Dates at Home</label>
														<textarea
															className="form-control w-100 text-center"
															name="dates"
															value={userEditForm.dates || ""}
															onChange={handleUserInputChange}
															placeholder="Enter dates separated by commas"
															style={{ resize: "none" }}
														/>
													</div>
													<div className="d-flex justify-content-around">
														<button
															className="btn btn-success me-2"
															onClick={() => handleUserSave(user._id)}
														>
															Save
														</button>
														<button
															className="btn btn-secondary"
															onClick={() => setEditingUserId(null)}
														>
															Cancel
														</button>
													</div>
												</div>
											) : (
												<div className="w-100">
													<h5 className="card-title">
														{user.name.first}{" "}
														{user.name.middle && `${user.name.middle} `}
														{user.name.last}
													</h5>
													<p className="card-text">{user.email}</p>
													<p className="card-text">
														{user.dates && user.dates.length > 0
															? `Home Dates: ${user.dates.join(", ")}`
															: "No home dates set"}
													</p>
													<div className="d-flex justify-content-around">
														<button
															className="btn btn-warning"
															onClick={() => handleEditUser(user)}
														>
															Edit
														</button>
														<button
															className="btn btn-danger"
															onClick={() => handleDeleteUser(user)}
														>
															Delete
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				) : (
					<>
						<h2 className="mb-4">Manage Ideas</h2>
						<div className="row">
							{ideas.map((idea) => {
								const ideaId = idea._id;
								return (
									<div
										className="col-md-4 d-flex align-items-stretch"
										key={ideaId}
									>
										<div
											className="card mb-3 w-100"
											style={{
												backgroundColor: "var(--color-surface)",
												borderRadius: "10px",
												color: "var(--color-text)",
												boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
											}}
										>
											<div className="card-body">
												{editingIdeaId === ideaId ? (
													<div>
														<div className="mb-2">
															<label>Date</label>
															<input
																type="text"
																className="form-control"
																name="date"
																value={ideaEditForm.date || ""}
																onChange={handleIdeaInputChange}
															/>
														</div>
														<div className="mb-2">
															<label>Content</label>
															<textarea
																className="form-control"
																name="content"
																value={ideaEditForm.content || ""}
																onChange={handleIdeaInputChange}
															/>
														</div>
														<div className="d-flex justify-content-around">
															<button
																className="btn btn-success me-2"
																onClick={() => handleIdeaSave(ideaId)}
															>
																Save
															</button>
															<button
																className="btn btn-secondary"
																onClick={() => setEditingIdeaId(null)}
															>
																Cancel
															</button>
														</div>
													</div>
												) : (
													<div>
														<h5 className="card-title">
															Idea from {idea.date}
														</h5>
														<p className="card-text">{idea.content}</p>
														<div className="d-flex justify-content-around">
															<button
																className="btn btn-warning"
																onClick={() => handleEditIdea(idea)}
															>
																Edit Idea
															</button>
															<button
																className="btn btn-danger"
																onClick={() => handleDeleteIdea(idea)}
															>
																Delete Idea
															</button>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>

			<ImageModal
				show={showImageModal}
				onHide={() => setShowImageModal(false)}
				imageUrl={selectedImageUrl}
			/>
		</div>
	);
}

export default Admin;
