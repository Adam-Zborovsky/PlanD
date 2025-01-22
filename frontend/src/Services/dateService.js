import axios from "axios";

const apiURL = "http://192.168.1.117:8181/dates/";

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
		data: { date }
	};
	return axios.request(config);
}