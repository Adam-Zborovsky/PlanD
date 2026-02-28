import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { ChangeContext } from "../context/ChangeContext";
import { deleteUser, getAllUsers, updateUser } from "../Services/userService";
import { deleteIdea, getAllIdeas, updateIdea } from "../Services/ideaService";
import { Link } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import { toast } from "react-toastify";

function Admin() {
	const { userData } = useContext(AuthContext);
	const { change } = useContext(ChangeContext);
	const [users, setUsers] = useState([]);
	const [ideas, setIdeas] = useState([]);
	const [viewMode, setViewMode] = useState("users");
	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState("");
	const [editingUserId, setEditingUserId] = useState(null);
	const [editingIdeaId, setEditingIdeaId] = useState(null);

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

	const userFormik = useFormik({
		initialValues: {
			name: {
				first: "",
				middle: "",
				last: "",
			},
			email: "",
			dates: "",
		},
		validationSchema: yup.object({
			name: yup.object().shape({
				first: yup
					.string()
					.min(2, "Must be at least 2 characters")
					.max(256, "Must be at most 256 characters")
					.required("First name is required"),
				middle: yup
					.string()
					.min(2, "Must be at least 2 characters")
					.max(256, "Must be at most 256 characters")
					.nullable(),
				last: yup
					.string()
					.min(2, "Must be at least 2 characters")
					.max(256, "Must be at most 256 characters")
					.required("Last name is required"),
			}),
			email: yup
				.string()
				.email("Invalid email format")
				.required("Email is required"),
			dates: yup.string(),
		}),
		onSubmit: async (values) => {
			if (!values.isAdmin) {
				const formData = new FormData();
				formData.append(
					"name",
					JSON.stringify({
						first: values.name.first,
						middle: values.name.middle,
						last: values.name.last,
					})
				);
				formData.append("email", values.email);

				const dates = values.dates
					.split(",")
					.map((date) => date.trim())
					.filter((date) => date);
				dates.forEach((date) => formData.append("dates", date));

				try {
					const res = await updateUser(editingUserId, formData);
					setUsers((prevUsers) =>
						prevUsers.map((user) =>
							user._id === editingUserId ? res.data.updatedUser : user
						)
					);
					setEditingUserId(null);
					change();
					toast.success("User updated successfully");
				} catch (err) {
					toast.error(err?.response?.data || "Error updating user");
				}
			}
		},
	});

	const ideaFormik = useFormik({
		initialValues: {
			date: "",
			content: "",
		},
		validationSchema: yup.object({
			date: yup.string().required("Date is required"),
			content: yup.string().required("Content is required"),
		}),
		onSubmit: async (values) => {
			try {
				const res = await updateIdea(editingIdeaId, values);
				setIdeas((prevIdeas) =>
					prevIdeas.map((idea) =>
						idea._id === editingIdeaId ? res.data : idea
					)
				);
				setEditingIdeaId(null);
				change();
				window.location.reload();
			} catch (err) {
				toast.error(err?.response?.data || "Error updating idea");
			}
		},
	});

	if (!userData.isAdmin) {
		return (
			<div className="container d-flex flex-column align-items-center">
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
			userFormik.setValues({
				name: {
					first: user.name.first,
					middle: user.name.middle,
					last: user.name.last,
				},
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
					toast.success("User deleted successfully");
				})
				.catch((err) =>
					toast.error(err?.response?.data || "Error deleting user")
				);
		}
	};

	const handleEditIdea = (idea) => {
		setEditingIdeaId(idea._id);
		ideaFormik.setValues({
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
				toast.success("Idea deleted successfully");
			})
			.catch((err) =>
				toast.error(err?.response?.data || "Error deleting idea")
			);
	};

	const handleImageClick = (imagePath) => {
		setSelectedImageUrl(imagePath);
		setShowImageModal(true);
	};

	const handleCancelUserEdit = () => {
		setEditingUserId(null);
		userFormik.resetForm();
	};

	const handleCancelIdeaEdit = () => {
		setEditingIdeaId(null);
		ideaFormik.resetForm();
	};

	return (
		<div className="container d-flex flex-column align-items-center justify-content-center">
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
						<div className="row" style={{ minWidth: "30vw" }}>
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
												src={user.image.path}
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
												<form
													onSubmit={userFormik.handleSubmit}
													className="w-100"
												>
													<div className="mb-2 w-100">
														<label>First Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="name.first"
															value={userFormik.values.name.first}
															onChange={userFormik.handleChange}
															onBlur={userFormik.handleBlur}
														/>
														{userFormik.touched.name?.first &&
															userFormik.errors.name?.first && (
																<div className="error-message text-danger">
																	{userFormik.errors.name.first}
																</div>
															)}
													</div>

													<div className="mb-2 w-100">
														<label>Middle Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="name.middle"
															value={userFormik.values.name.middle}
															onChange={userFormik.handleChange}
															onBlur={userFormik.handleBlur}
														/>
														{userFormik.touched.name?.middle &&
															userFormik.errors.name?.middle && (
																<div className="error-message text-danger">
																	{userFormik.errors.name.middle}
																</div>
															)}
													</div>

													<div className="mb-2 w-100">
														<label>Last Name</label>
														<input
															type="text"
															className="form-control w-100 text-center"
															name="name.last"
															value={userFormik.values.name.last}
															onChange={userFormik.handleChange}
															onBlur={userFormik.handleBlur}
														/>
														{userFormik.touched.name?.last &&
															userFormik.errors.name?.last && (
																<div className="error-message text-danger">
																	{userFormik.errors.name.last}
																</div>
															)}
													</div>

													<div className="mb-2 w-100">
														<label>Email</label>
														<input
															type="email"
															className="form-control w-100 text-center"
															name="email"
															value={userFormik.values.email}
															onChange={userFormik.handleChange}
															onBlur={userFormik.handleBlur}
														/>
														{userFormik.touched.email &&
															userFormik.errors.email && (
																<div className="error-message text-danger">
																	{userFormik.errors.email}
																</div>
															)}
													</div>

													<div className="mb-2 w-100">
														<label>Dates at Home</label>
														<textarea
															className="form-control w-100 text-center"
															name="dates"
															value={userFormik.values.dates}
															onChange={userFormik.handleChange}
															onBlur={userFormik.handleBlur}
															placeholder="Enter dates separated by commas"
															style={{ resize: "none" }}
														/>
													</div>

													<div className="d-flex justify-content-around">
														<button
															type="submit"
															className="btn btn-success me-2"
															disabled={
																!userFormik.dirty || !userFormik.isValid
															}
														>
															Save
														</button>
														<button
															type="button"
															className="btn btn-secondary"
															onClick={handleCancelUserEdit}
														>
															Cancel
														</button>
													</div>
												</form>
											) : (
												<div className="w-100">
													{user.name && (
														<h5 className="card-title">
															{user.name.first}{" "}
															{user.name.middle && ` ${user.name.middle} `}
															{user.name.last}
														</h5>
													)}
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
							{ideas.map((idea) => (
								<div
									className="col-md-4 d-flex align-items-stretch"
									key={idea._id}
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
											{editingIdeaId === idea._id ? (
												<form onSubmit={ideaFormik.handleSubmit}>
													<div className="mb-2">
														<label>Date</label>
														<input
															type="text"
															className="form-control"
															name="date"
															value={ideaFormik.values.date}
															onChange={ideaFormik.handleChange}
															onBlur={ideaFormik.handleBlur}
														/>
														{ideaFormik.touched.date &&
															ideaFormik.errors.date && (
																<div className="error-message text-danger">
																	{ideaFormik.errors.date}
																</div>
															)}
													</div>
													<div className="mb-2">
														<label>Content</label>
														<textarea
															className="form-control"
															name="content"
															value={ideaFormik.values.content}
															onChange={ideaFormik.handleChange}
															onBlur={ideaFormik.handleBlur}
														/>
														{ideaFormik.touched.content &&
															ideaFormik.errors.content && (
																<div className="error-message text-danger">
																	{ideaFormik.errors.content}
																</div>
															)}
													</div>
													<div className="d-flex justify-content-around">
														<button
															type="submit"
															className="btn btn-success me-2"
															disabled={
																!ideaFormik.dirty || !ideaFormik.isValid
															}
														>
															Save
														</button>
														<button
															type="button"
															className="btn btn-secondary"
															onClick={handleCancelIdeaEdit}
														>
															Cancel
														</button>
													</div>
												</form>
											) : (
												<div>
													<h5 className="card-title">Idea from {idea.date}</h5>
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
							))}
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
