import axios from "axios";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
};

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.timeout = 10000;
//axios.defaults.headers.post["Content-Type"] = "application/json";

const request = (type, path, body) => {
  if (!localStorage.getItem("previousLocation")) {
    localStorage.setItem("previousLocation", window.location.pathname);
  }

  const isFormData = body instanceof FormData;

  return axios
    .request({
      url: path,
      method: type,
      data: body,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: getToken(),
      },
      withCredentials: true,
    })
    .then((response) => {
      // qué pasa si !response.ok
      // TODO: devolver response.data
      return response;
    });
};

const handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (true) {
      case status == 403:
        localStorage.setItem("previousLocation", window.location.pathname);
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return "Credenciales erroneas";
      case status >= 400 && status !== 403 && status < 500:
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
  sendMsgWithFiles: (body) => request("post", "/send-multiple-files", body),
  getPatientRecord: (id, page) =>
    request("get", `/patient/records/${id}/${page}`),
  getWhatsappQr: () => request("get", `/qr`),
  getTeethAtDate: (id, date) =>
    request("get", `/tooth/${id}/version?date=${date}`),
  getPatientJournal: (id, pageNumber) =>
    request("get", `/patient/journal/${id}/${pageNumber}`),
  postPatientJournal: (id, body) =>
    request("post", `/patient/journal/add/${id}`, body),
  patchDentistTags: (body) => request("patch", "/dentist/update/tags", body),
  updatePatient: (body) => request("put", "/patient/update", body),
  getDentistPatinet: (pageNumber) =>
    request("get", `/dentist/patient/${pageNumber}`),
  addTurn: (body) => request("post", "/turn/add", body),
  rescheduleTurn: (date, body) =>
    request("post", `/turn/reschedule/${date}`, body),
};

export default API;
export { handleApiError };
