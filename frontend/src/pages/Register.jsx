import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/Register.css";
import { registerUser } from "../Services/userService";

function Register() {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const formik = useFormik({
		initialValues: {
			name: { first: "", middle: "", last: "" },
			email: "",
			password: "",
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
			password: yup
				.string()
				.min(6, "Must be at least 6 characters")
				.matches(
					/^(?=.*[A-Za-z])(?=.*\d)/,
					"Must contain at least one letter and one number"
				)
				.required("Password is required"),
		}),
		onSubmit: async (values) => {
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
			formData.append("password", values.password);

			const file = fileInputRef.current?.files?.[0];
			if (file) {
				formData.append("profilePicture", file);
			}
			registerUser(formData)
				.then((res) => {
					if (res.data) {
						login(res.data);
						navigate("/");
					}
				})
				.catch((err) => toast.error(err.response?.data));
		},
	});

	return (
		<div
			className="container register-container d-flex justify-content-center align-items-start"
			style={{ height: "100vh", gap: "5vh" }}
		>
			<div className="card register-card p-4">
				<form onSubmit={formik.handleSubmit} className="register-form">
					<h3 className="form-title">Register</h3>

					<div className="form-section">
						<h4>Personal Information</h4>
						<div className="row">
							<div className="form-group col-12 col-md-4">
								<label>First Name:</label>
								<input
									type="text"
									name="name.first"
									className="form-control"
									value={formik.values.name.first}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.name?.first && formik.errors.name?.first && (
									<div className="error-message">
										{formik.errors.name.first}
									</div>
								)}
							</div>

							<div className="form-group col-12 col-md-4">
								<label>Middle Name:</label>
								<input
									type="text"
									name="name.middle"
									className="form-control"
									value={formik.values.name.middle}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.name?.middle && formik.errors.name?.middle && (
									<div className="error-message">
										{formik.errors.name.middle}
									</div>
								)}
							</div>

							<div className="form-group col-12 col-md-4">
								<label>Last Name:</label>
								<input
									type="text"
									name="name.last"
									className="form-control"
									value={formik.values.name.last}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.name?.last && formik.errors.name?.last && (
									<div className="error-message">{formik.errors.name.last}</div>
								)}
							</div>
						</div>
					</div>

					<div className="form-section">
						<h4>Contact Information</h4>

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

						<div className="mb-3">
							<label>Password:</label>
							<input
								type="password"
								name="password"
								className="form-control"
								value={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							{formik.touched.password && formik.errors.password && (
								<div className="error-message">{formik.errors.password}</div>
							)}
						</div>
					</div>

					<div className="form-section">
						<h4>Profile Picture (Optional)</h4>
						<div className="form-group">
							<input
								type="file"
								name="profilePicture"
								accept="image/*"
								ref={fileInputRef}
								className="form-control"
							/>
						</div>
					</div>

					<div className="form-actions d-flex align-items-center mt-4">
						<button
							className="btn btn-success"
							type="submit"
							disabled={!(formik.dirty && formik.isValid)}
						>
							Register
						</button>
						<Link to="/" className="secondary-link">
							Already have an account? Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
