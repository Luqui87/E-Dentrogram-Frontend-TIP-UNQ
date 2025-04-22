import axios from "axios";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
};

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json";

const request = (type, path, body) => {
  return axios
    .request({
      url: path,
      method: type,
      data: body,
      headers: {
        "Content-Type": "application/json", // "Authorization": getToken(), // si usás token más adelante
        Authorization: getToken(),
      },
      withCredentials: true,
    })
    .then((response) => {
      // qué pasa si !response.ok
      // TODO: devolver response.data
      return response;
    })
    .catch((reason) => {
      if (reason.response.status == 403) {
        window.history.replaceState(null, null, "/");
        location.reload();
      }
    });
};

const API = {
  getAllSimplePatients: () => request("get", "/allSimplePatients"),
  getDentist: (username) => request("get", `/dentist/user`),
  getPatient: (id) => request("get", `/patient/${id}`),
  updateTeeth: (id, body) => request("put", `/update/tooth/${id}`, body),
  register: (body) => request("post", "/register", body),
  login: (body) => request("post", "/login", body),
  removePatient: (dentistId, patientMedicalRecord) =>
    request("put", `/dentist/Remove/${dentistId}/${patientMedicalRecord}`),
};

export default API;
