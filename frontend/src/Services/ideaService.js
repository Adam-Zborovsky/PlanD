import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL + "/ideas/";

export function addIdea(id, data) {
	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: data,
	};

	return axios.request(config);
}

export function getIdeas(date) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + date,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}

export function getMostVotedIdea(date) {
	let config = {
		method: "get",
		maxBodyLength: Infinity,
		url: apiURL + "most-voted/" + date,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}

export function voteForIdea(id) {
	let config = {
		method: "patch",
		maxBodyLength: Infinity,
		url: apiURL + id + "/vote",
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
	};
	return axios.request(config);
}

export function updateIdea(id, idea) {
	let config = {
		method: "delete",
		maxBodyLength: Infinity,
		url: apiURL + id,
		headers: {
			"x-auth-token": localStorage.getItem("token"),
		},
		data: idea,
	};
	return axios.request(config);
}

export function deleteIdea(id) {
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
