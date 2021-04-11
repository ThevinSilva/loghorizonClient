import axios from "axios";

// TEMPORARY CONSTANT

const server = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_SERVER + "/friend",
});

export const listData = (data) => {
  /**
   *[fetches username and id for each item in a list of ids ]
   * @param  {[list]}     [e.g ["1238120938120938","123123123123"...] ]
   * @return {[list]}     [{_id:231231232897987, username: "jeff", img:"http://googleimageexampple"}]
   */
  return server.post("list", { data });
};

export const pendingData = () => {
  return server.get("pending");
};

export const sentData = () => {
  return server.get("sent");
};

export const searchData = (data) => {
  return server.post("search", { data });
};

export const requestData = (id) => {
  return server.get(`request/${id}`);
};

export const checkData = (data) => {
  return server.post("check", { ...data });
};

export const docsData = () => {
  return axios({
    url: process.env.REACT_APP_SERVER + "/friend/docs",
    method: "GET",
    responseType: "blob", // Important,
    withCredentials: true,
  });
};
