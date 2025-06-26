import React, { useState, useEffect } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";
import API from "../../service/API.jsx";
import {handleApiError} from "../../service/API.jsx";
import "../../components/loader.css";
import { toast } from "react-toastify";
import PatientModal from "../../components/PatientModal/PatientModal.jsx";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [dentistId, setDentistId] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setLoading(true);

    API.getDentist(localStorage.getItem("username"))
      .then((res) => {
        setPatients(res.data.patients);
        setDentistId(res.data.dentistID);
        setLoading(false); 
        localStorage.setItem('userTags', JSON.stringify(res.data.tags));
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      });
  }, []);

  return loading ? (
    <div className="home-container">
      <span class="loader" style={{ margin: "auto" }}></span>
    </div>
  ) : (
    <div className="home-container">
      <div className="top-bar">
        <h1>Listado de Pacientes</h1>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleAddClick} className="add-button">
          Agregar Paciente +
        </button>
      </div>

      <PatientModal
        showModal={showModal}
        onClose={handleCloseModal}
        dentistId={dentistId}
        setPatients={setPatients}
      />

      <PersonTable
        patients={patients}
        searchTerm={searchTerm}
        setPatients={setPatients}
        dentistId={dentistId}
      />
    </div>
  );
};

export default Home;
