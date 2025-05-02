import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonTable.css";
import API from "../../service/API";
import handleApiError from "../../service/API";
import { toast } from "react-toastify";

const PersonTable = ({ patients, searchTerm, setPatients, dentistId }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const filteredPersons = patients.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/paciente/${id}`);
  };

  const handleDeleteClick = (id, event) => {
    event.stopPropagation();
    setPatientToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    API.removePatient(dentistId, patientToDelete)
      .then(() => {
        toast.success("Se ha eliminado al paciente");
        setPatients((prev) =>
          prev.filter((person) => person.medicalRecord !== patientToDelete)
        );
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      })
      .finally(() => {
        setShowModal(false);
        setPatientToDelete(null);
      });
  };

  return (
    <div className="table-container">
      <table className="person-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>N° Historia Clínica</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredPersons.map((person) => (
            <tr
              key={person.medicalRecord}
              onClick={() => handleRowClick(person.medicalRecord)}
            >
              <td>{person.name}</td>
              <td>{person.medicalRecord}</td>
              <td>{person.dni}</td>
              <td>{person.telephone}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={(event) =>
                    handleDeleteClick(person.medicalRecord, event)
                  }
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Estás seguro de que deseas eliminar al paciente?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-button">
                Confirmar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonTable;
