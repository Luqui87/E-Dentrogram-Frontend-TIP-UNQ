import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json";

const request = (type, path, body) => {
  return axios
    .request({
      url: path,
      method: type,
      data: body,
      headers: {}, //authorization: getToken()
    })
    .then((response) => {
      return response;
    });
};

const API = {
  getAllSimplePatients: () => request("get", "/allSimplePatients"),
};

export default API;
