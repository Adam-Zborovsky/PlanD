import axios from "axios";

const apiURL = "http://localhost:8181/dates/";

export function addDate(id, date) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: date,
	};
	return axios.request(config);
}
