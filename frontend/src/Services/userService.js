import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "/users/";

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

export function registerUser(formData) {
	console.log(apiURL);
	const config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL,
		headers: {
			"Content-Type": "multipart/form-data",
		},
		data: formData,
	};

	return axios
		.request(config)
		.then((res) => {
			if (res.status === 201) {
				const loginConfig = {
					method: "post",
					maxBodyLength: Infinity,
					url: `${apiURL}login`,
					headers: {
						"Content-Type": "application/json",
					},
					data: {
						email: formData.get("email"),
						password: formData.get("password"),
					},
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

export function getAllUsers() {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL,
	};
	return axios.request(config);
}

export function getToken(id) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + "token/" + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}

export function getUser(id) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}

export function updateUser(id, user) {
	let config = {
		method: "put",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
			"Content-Type": "multipart/form-data",
		},
		data: user,
	};
	return axios.request(config);
}

export function deleteUser(id) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}
