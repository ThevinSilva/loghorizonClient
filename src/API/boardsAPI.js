import axios from "axios";

// TEMPORARY CONSTANT

const server = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_SERVER + "/board",
});

export const submitBoardData = (data) => {
  /**
   *
   * @param  {[list]}
   * @example  [e.g ["1238120938120938","123123123123"...] ]
   * @return {[list]}
   * @example [{_id:231231232897987, username: "jeff", img:"http://googleImageExampple"}]
   */
  return server.post("create", { data });
};

export const listData = (data) => {
  /**
   *[fetches username and id per each item in a list of ids ]
   * @param  {[list]}     [e.g ["1238120938120938","123123123123"...] ]
   * @return {[list]}     [{_id:231231232897987, username: "jeff", img:"http://googleImageExampple"}]
   */
  return server.post("list", { data });
};

export const searchData = (data) => {
  // searches for users other than your self
  return server.post("people-search", { data });
};

export const boardData = (data) => {
  return server.post("data", { data });
};

export const loginInfo = (data) => {
  return server.post("login", { data });
};

export const checkBoardName = (data) => {
  return server.post("check", { data });
};

export const authorize = (data) => {
  return server.post("authorize", { data });
};

export const load = (data) => {
  return server.post("load-posts", { data });
};

export const category = (data) => {
  return server.post("category", { data });
};

export const trending = () => {
  return server.get("trending");
};

export const devPost = (data) => {
  return server.post("dev/post");
};
