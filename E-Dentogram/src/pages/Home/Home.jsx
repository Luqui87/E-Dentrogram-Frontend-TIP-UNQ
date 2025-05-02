import React, { useState, useEffect } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";
import API from "../../service/API.jsx";
import handleApiError from "../../service/API.jsx";
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
    // useEffect(async () => {
    // try {
    //   setLoading(true);

    //   const [_patients, _otraCosa] = await API.getAllSimplePatients();
    //   setPatients(_patients);
    // }
    // finally {
    //   setLoading(false)
    // }
    setLoading(true);

    API.getDentist(localStorage.getItem("username"))
      .then((res) => {
        setPatients(
          [
              {
                "medicalRecord": 318,
                "dni": 412345678,
                "name": "Carlos Fernández",
                "address": "Mitre 789",
                "birthdate": "1988-09-14",
                "telephone": 1167890123,
                "email": "carlos.fernandez@gmail.com"
              },
              {
                "medicalRecord": 507,
                "dni": 437654321,
                "name": "Ana Martínez",
                "address": "San Martín 456",
                "birthdate": "1992-12-30",
                "telephone": 1156789012,
                "email": "ana.martinez@gmail.com"
              },
              {
                "medicalRecord": 134,
                "dni": 42594982,
                "name": "Lucas Alvarez",
                "address": "Bragado 1947",
                "birthdate": "2000-10-12",
                "telephone": 1153276406,
                "email": "alvarezlucas@gmail.com"
              },
              {
                "medicalRecord": 623,
                "dni": 405678912,
                "name": "Sofía Ramírez",
                "address": "Corrientes 333",
                "birthdate": "1999-07-18",
                "telephone": 1176543289,
                "email": "sofia.ramirez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              },
              {
                "medicalRecord": 215,
                "dni": 429875421,
                "name": "María López",
                "address": "Av. Rivadavia 2020",
                "birthdate": "1995-05-23",
                "telephone": 1145678920,
                "email": "maria.lopez@gmail.com"
              }
            ]
  
        );
        setDentistId(res.data.dentistID);
        setLoading(false);
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
