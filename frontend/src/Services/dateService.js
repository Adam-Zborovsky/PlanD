import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "/dates/";

export function addDate(id, date) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: { date },
	};
	return axios.request(config);
}

export function getDates(id) {
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

export function DeleteDate(id, date) {
	let config = {
		method: "patch",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: { date },
	};
	return axios.request(config);
}
