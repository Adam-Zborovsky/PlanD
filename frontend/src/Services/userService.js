import axios from "axios";

const apiURL = "http://localhost:8181/users/";

export function loginUser(user) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL + "login",
		headers: {
			"Content-Type": "application/json",
		},
		data: user,
	};

	return axios.request(config);
}

export function registerUser(user) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "application/json",
		},
		data: user,
	};

	return axios
		.request(config)
		.then((res) => {
			console.log("res", res);

			if (res.status === 200) {
				console.log("email:" + user.email, " password:" + user.password);

				let loginConfig = {
					method: "post",
					maxBodyLength: Infinity,
					url: apiURL + "login",
					headers: {
						"Content-Type": "application/json",
					},
					data: { email: user.email, password: user.password },
				};

				return axios.request(loginConfig);
			}
			return res;
		})
		.catch((err) => {
			console.error(err);
			throw err;
		});
}

export function updateUser(user, id) {
	let config = {
		method: "put",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: user,
	};
	return axios.request(config);
}
