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


  const deleteIcon = <svg className="delete-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

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
              <td className="buttons">
                <button
                  className="delete-button"
                  onClick={(event) =>
                    handleDeleteClick(person.medicalRecord, event)
                  }
                  
                >
                  {deleteIcon}
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
