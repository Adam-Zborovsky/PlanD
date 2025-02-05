import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";
import { loginUser } from "../Services/userService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: yup.object({
			email: yup
				.string()
				.required("Email is required")
				.email("Invalid email format"),
			password: yup
				.string()
				.required("Password is required")
				.min(6, "Must be at least 6 characters")
				.matches(
					/^(?=.*[A-Za-z])(?=.*\d)/,
					"Must contain at least one letter and one number"
				),
		}),
		onSubmit: async (values) => {
			loginUser(values)
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
		<div
			className="login-container d-flex justify-content-center align-items-start"
			style={{ gap: "5vh" }}
		>
			<div className="card login-card">
				<h3 className="text-center mb-4">Login</h3>

				<form onSubmit={formik.handleSubmit}>
					<div className="mb-3">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className={`form-control ${
								formik.touched.email && formik.errors.email ? "is-invalid" : ""
							}`}
							placeholder="name@example.com"
							value={formik.values.email}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.email && formik.errors.email && (
							<div className="invalid-feedback">{formik.errors.email}</div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							className={`form-control ${
								formik.touched.password && formik.errors.password
									? "is-invalid"
									: ""
							}`}
							placeholder="Enter your password"
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.password && formik.errors.password && (
							<div className="invalid-feedback">{formik.errors.password}</div>
						)}
					</div>

					<button
						type="submit"
						className="btn btn-login w-100"
						disabled={!formik.dirty || !formik.isValid}
					>
						Login
					</button>

					<div className="text-center mt-3">
						<Link to="/register" className="register-link">
							New User? Register Now!
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
