import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonTable.css";
import API, { handleApiError } from "../../service/API";
import { toast } from "react-toastify";
import PatientModal from "../PatientModal/PatientModal";

const PersonTable = ({ searchTerm, dentistId }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editPatient, setEditPatient] = useState(null);

  useEffect(() => {
    if (!dentistId) return;

    setLoading(true);

    const fetchPatients =
      searchTerm.trim() === ""
        ? API.getDentistPatinet(currentPage)
        : API.getDentistPatientByQuery(searchTerm, currentPage);

    fetchPatients
      .then((res) => {
        setPatients(res.data.patients);
        setPageSize(res.data.pageSize);
        setTotalPages(Math.ceil(res.data.total / res.data.pageSize));
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      })
      .finally(() => setLoading(false));
  }, [currentPage, dentistId, searchTerm]);

  const handleRowClick = (id) => navigate(`/paciente/${id}`);

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
          prev.filter((p) => p.medicalRecord !== patientToDelete)
        );
      })
      .catch((error) => toast.error(handleApiError(error)))
      .finally(() => {
        setShowModal(false);
        setPatientToDelete(null);
      });
  };

  const handleEdit = (patient, event) => {
    event.stopPropagation();
    setShowEdit(true);
    setEditPatient(patient);
  };

  const handleEditedPatient = (patient) => {
    const updatedPatients = patients
      .filter((p) => p.medicalRecord !== patient.medicalRecord)
      .concat(patient);

    setPatients(updatedPatients);
    setShowEdit(false);
    setEditPatient(null);
  };

  const renderPagination = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="nav-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          « Anterior
        </button>
        {buttons}
        <button
          className="nav-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Siguiente »
        </button>
      </div>
    );
  };

  const deleteIcon = (
    <svg viewBox="0 0 24 24" fill="none">
      {/* ícono de borrar */}
      <path d="M10 12V17" stroke="#ff0909" strokeWidth="2" />
      <path d="M14 12V17" stroke="#ff0909" strokeWidth="2" />
      <path d="M4 7H20" stroke="#ff0909" strokeWidth="2" />
      <path
        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
        stroke="#ff0909"
        strokeWidth="2"
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke="#ff0909"
        strokeWidth="2"
      />
    </svg>
  );

  const editIcon = (
    <svg viewBox="0 0 24 24" fill="none">
      {/* ícono de editar */}
      <path
        d="M21.28 6.4L11.74 15.94C10.79 16.89 7.97 17.33 7.34 16.7C6.71 16.07 7.14 13.25 8.09 12.3L17.64 2.75"
        stroke="#aaaaaa"
        strokeWidth="1.5"
      />
      <path
        d="M11 4H6C4.94 4 3.92 4.42 3.17 5.17C2.42 5.92 2 6.94 2 8V18C2 19.06 2.42 20.08 3.17 20.83C3.92 21.58 4.94 22 6 22H17C19.21 22 20 20.2 20 18V13"
        stroke="#aaaaaa"
        strokeWidth="1.5"
      />
    </svg>
  );

  return (
    <>
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
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Cargando...
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((person) => (
                <tr
                  key={person.medicalRecord}
                  onClick={() => handleRowClick(person.medicalRecord)}
                >
                  <td>{person.name}</td>
                  <td>{person.medicalRecord}</td>
                  <td>{person.dni}</td>
                  <td>{parseInt(person.telephone.toString().slice(2))}</td>
                  <td className="buttons">
                    <button
                      className="table-button"
                      onClick={(event) => handleEdit(person, event)}
                    >
                      {editIcon}
                    </button>
                    <button
                      className="table-button"
                      onClick={(event) =>
                        handleDeleteClick(person.medicalRecord, event)
                      }
                    >
                      {deleteIcon}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No hay pacientes
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination()}

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

      <PatientModal
        showModal={showEdit}
        onClose={() => setShowEdit(false)}
        patient={editPatient}
        handleEditedPatient={handleEditedPatient}
      />
    </>
  );
};

export default PersonTable;
