import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/Register.css";
import { registerUser } from "../Services/userService";

function Register() {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleFileChange = (e) => {
		const file = e.currentTarget.files[0];
		// formik.setFieldValue("image.file", file);
	};

	const formik = useFormik({
		initialValues: {
			name: { first: "", middle: "", last: "" },
			email: "",
			password: "",
			image: { url: "", alt: "" },
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
			image: yup.object().shape({
				url: yup
					.string()
					.min(2, "Must be at least 2 characters")
					.max(256, "Must be at most 256 characters"),
				alt: yup
					.string()
					.min(2, "Must be at least 2 characters")
					.max(256, "Must be at most 256 characters")
					.nullable(),
			}),
		}),
		onSubmit: (values) => {
			registerUser(values)
				.then((res) => {
					if (res.data) {
						login(res.data);
						navigate("/");
					}
				})
				.catch((err) => toast.error(err.response.data));
		},
	});

	return (
		<div className="register-container d-flex justify-content-center align-items-center">
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
						<div className="row">
							<div className="form-group col-12 col-md-6">
								<label>Upload Image:</label>
								<input
									type="text"
									name="image.url"
									className="form-control"
									onChange={handleFileChange}
									onBlur={formik.handleBlur}
									accept="image/*"
								/>
							</div>

							<div className="form-group col-12 col-md-6">
								<label>Alt Text:</label>
								<input
									type="text"
									name="image.alt"
									className="form-control"
									value={formik.values.image.alt}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.image?.alt && formik.errors.image?.alt && (
									<div className="error-message">{formik.errors.image.alt}</div>
								)}
							</div>
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
						<Link to="/login" className="secondary-link">
							Already have an account? Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
