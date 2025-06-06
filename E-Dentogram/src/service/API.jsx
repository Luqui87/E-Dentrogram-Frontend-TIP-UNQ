import axios from "axios";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
};

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.timeout = 10000;
axios.defaults.headers.post["Content-Type"] = "application/json";

const request = (type, path, body) => {
  if (!localStorage.getItem("previousLocation")) {
    localStorage.setItem("previousLocation", window.location.pathname);
  }

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
      if (reason.response.status === 403) {
        localStorage.setItem("previousLocation", window.location.pathname);
        window.history.replaceState(null, null, "/");
        location.reload();
      }
    });
};

const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (true) {
      case status >= 400 && status < 500:
        return "Error del cliente.";
      case status >= 500:
        return "Error del servidor. Consulte al administrador.";
      default:
        return "Error inesperado.";
    }
  } else {
    return "No se pudo conectar con el servidor.";
  }
};

const API = {
  getAllSimplePatients: () => request("get", "/allSimplePatients"),
  getDentist: () => request("get", `/dentist/user`),
  getPatient: (id) => request("get", `/patient/${id}`),
  updateTeeth: (id, body) => request("put", `/update/tooth/${id}`, body),
  register: (body) => request("post", "/register", body),
  login: (body) => request("post", "/login", body),
  loginGoogle: (body) => request("post", "/login/google", body),
  registerGoogle: (body) => request("post", "/register/google", body),
  removePatient: (dentistId, patientMedicalRecord) =>
  request("put", `/dentist/Remove/${dentistId}/${patientMedicalRecord}`),
  addPatient: (dentistId, body) =>
  request("post", `/dentist/add/${dentistId}`, body),
  sendWhatsapp: (body) => request("post", "/send", body),
  getPatientRecord: (id,page) => request("get", `/patient/records/${id}/${page}`)
};

export default API;
