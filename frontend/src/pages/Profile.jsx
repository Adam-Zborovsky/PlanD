import React, { useState, useContext, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChangeContext } from "../context/ChangeContext";
import { updateUser, deleteUser, getUser } from "../Services/userService";
import { FaEdit, FaSignOutAlt, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/Profile.css";

function Profile() {
	const { userData, logout, isAuthenticated } = useContext(AuthContext);
	const { change, changed } = useContext(ChangeContext);
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState({});
	const [initialValues, setInitialValues] = useState({
		firstName: "",
		middleName: "",
		lastName: "",
		email: "",
		dates: "",
	});
	const [showConfirm, setShowConfirm] = useState(false);
	const fileInputRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			const token = localStorage.getItem("token");
			if (!token) {
				navigate("/login");
			}
		}
	}, [isAuthenticated, navigate]);

	const formik = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: yup.object({
			firstName: yup
				.string()
				.min(2, "Must be at least 2 characters")
				.max(256, "Must be at most 256 characters")
				.required("First name is required"),
			middleName: yup
				.string()
				.min(2, "Must be at least 2 characters")
				.max(256, "Must be at most 256 characters")
				.nullable(),
			lastName: yup
				.string()
				.min(2, "Must be at least 2 characters")
				.max(256, "Must be at most 256 characters")
				.required("Last name is required"),
			email: yup
				.string()
				.email("Invalid email format")
				.required("Email is required"),
			dates: yup.string(),
		}),
		onSubmit: async (values) => {
			const formData = new FormData();

			formData.append(
				"name",
				JSON.stringify({
					first: values.firstName,
					middle: values.middleName,
					last: values.lastName,
				})
			);
			formData.append("email", values.email);
			formData.append("dates", values.dates);

			const file = fileInputRef.current?.files?.[0];
			if (file) {
				formData.append("profilePicture", file);
			}

			try {
				await updateUser(user._id, formData);
				setUser((prevUser) => ({
					...prevUser,
					name: {
						first: values.firstName,
						middle: values.middleName,
						last: values.lastName,
					},
					email: values.email,
					dates: values.dates.split(", "),
					image: {
						...prevUser.image,
						path: formData.get("profilePicture")
							? URL.createObjectURL(formData.get("profilePicture"))
							: prevUser.image.path,
					},
				}));
				toast.success("User Updated Successfully");
				change();
			} catch (err) {
				toast.error(err?.response?.data || err.message);
			}

			setIsEditing(false);
		},
	});

	useEffect(() => {
		if (userData._id) {
			getUser(userData._id)
				.then((res) => {
					setUser(res.data);
					setInitialValues({
						firstName: res.data.name.first || "",
						middleName: res.data.name.middle || "",
						lastName: res.data.name.last || "",
						email: res.data.email || "",
						dates: res.data.dates.join(", ") || "",
					});
				})
				.catch((err) => console.log(err?.response?.data || err.message));
		}
	}, [userData, changed]);

	const handleDelete = async () => {
		try {
			await deleteUser(userData._id);
			logout();
			navigate("/");
		} catch (err) {
			toast.error(err?.response?.data || err.message);
		}
	};

	const handleCancel = () => {
		formik.resetForm();
		setIsEditing(false);
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			formik.setFieldValue("profilePicture", file);
			formik.setTouched({ ...formik.touched, profilePicture: true });
		}
	};

	return (
		<>
			<div className="container profile-container d-flex justify-content-center align-items-start">
				<div className="card profile-card p-4">
					<div className="profile-header text-center">
						{user.image?.path ? (
							<img
								src={user.image.path}
								alt={user.image.alt}
								className="profile-picture mb-3"
							/>
						) : (
							<div className="profile-picture-placeholder mb-3">
								<span>No Image</span>
							</div>
						)}

						{!isEditing && (
							<>
								<h3 className="profile-name">
									{user?.name?.first} {user?.name?.middle} {user?.name?.last}
								</h3>
								<p className="profile-email">{user?.email}</p>

								{user?.dates?.length > 0 && (
									<div className="profile-dates mt-3">
										<h5>Dates</h5>
										<ul>
											{user.dates.map((date, idx) => (
												<li key={idx}>{date}</li>
											))}
										</ul>
									</div>
								)}
							</>
						)}
					</div>

					{isEditing && (
						<form onSubmit={formik.handleSubmit} className="profile-form">
							<h4>Edit Profile</h4>
							<div className="form-section">
								<div className="row">
									<div className="form-group col-12 col-md-4">
										<label>First Name:</label>
										<input
											type="text"
											name="firstName"
											className="form-control"
											value={formik.values.firstName}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.firstName && formik.errors.firstName && (
											<div className="error-message">
												{formik.errors.firstName}
											</div>
										)}
									</div>

									<div className="form-group col-12 col-md-4">
										<label>Middle Name:</label>
										<input
											type="text"
											name="middleName"
											className="form-control"
											value={formik.values.middleName}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.middleName && formik.errors.middleName && (
											<div className="error-message">
												{formik.errors.middleName}
											</div>
										)}
									</div>

									<div className="form-group col-12 col-md-4">
										<label>Last Name:</label>
										<input
											type="text"
											name="lastName"
											className="form-control"
											value={formik.values.lastName}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										{formik.touched.lastName && formik.errors.lastName && (
											<div className="error-message">
												{formik.errors.lastName}
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="form-section">
								<div className="mb-3">
									<label>Email:</label>
									<input
										type="email"
										name="email"
										className="form-control"
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.email && formik.errors.email && (
										<div className="error-message">{formik.errors.email}</div>
									)}
								</div>
							</div>

							<div className="form-section">
								<div className="mb-3">
									<label>Dates at Home</label>
									<textarea
										className="form-control w-100 text-center"
										name="dates"
										value={formik.values.dates}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										placeholder="Enter dates separated by commas"
										style={{ resize: "none" }}
									/>
									{formik.touched.dates && formik.errors.dates && (
										<div className="error-message">{formik.errors.dates}</div>
									)}
								</div>
							</div>

							<div className="form-section">
								<h5>Change Profile Picture (Optional)</h5>
								<div className="form-group">
									<input
										type="file"
										name="profilePicture"
										accept="image/*"
										ref={fileInputRef}
										className="form-control"
										onChange={handleFileChange}
									/>
								</div>
							</div>
							<div className="profile-edit-actions d-flex justify-content-between gap-3 mt-4">
								<button
									type="submit"
									className="btn btn-primary"
									style={{
										width: "90px",
										height: "40px",
										fontSize: "0.7rem",
									}}
									disabled={!(formik.dirty && formik.isValid)}
								>
									<FaSave className="me-2" />
									Save
								</button>

								<button
									type="button"
									className="btn btn-secondary"
									style={{
										width: "95px",
										height: "40px",
										fontSize: "0.7rem",
									}}
									onClick={handleCancel}
								>
									<FaTimes className="me-2" />
									Cancel
								</button>

								<button
									type="button"
									className="btn btn-danger"
									style={{
										width: "90px",
										height: "40px",
										fontSize: "0.7rem",
									}}
									onClick={() => setShowConfirm(true)}
								>
									<FaTrash className="me-2" />
									Delete
								</button>
							</div>
						</form>
					)}

					{!isEditing && (
						<div className="profile-view-actions d-flex justify-content-between mt-4">
							<button
								className="btn btn-info"
								style={{
									width: "90px",
									height: "40px",
									fontSize: "14px",
								}}
								onClick={() => setIsEditing(true)}
							>
								<FaEdit className="me-2" />
								Edit
							</button>

							<button
								className="btn btn-warning"
								style={{
									width: "90px",
									height: "40px",
									fontSize: "12px",
								}}
								onClick={handleLogout}
							>
								<FaSignOutAlt className="me-2" />
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
			<ConfirmModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				action={handleDelete}
				title="Delete Account"
				message="Are you sure you want to delete your account? This action is irreversible."
			/>
		</>
	);
}

export default Profile;
