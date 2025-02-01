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

export function deleteDate(id, date) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: { date },
	};
	return axios.request(config);
}
