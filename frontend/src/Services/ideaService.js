import axios from "axios";

const apiURL = "http://192.168.1.117:8181/ideas/";

export function addIdea(id, idea) {
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: apiURL + id,
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
        data: { idea },
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

export function DeleteIdea(id, idea) {
    let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: apiURL + id,
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
        data: { idea }
    };
    return axios.request(config);
}