import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonTable.css";
import API, { handleApiError } from "../../service/API";
import { toast } from "react-toastify";

const PersonTable = ({ searchTerm, dentistId }) => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    if (!dentistId) return;

    setLoading(true);

    API.getDentistPatinet(currentPage)
      .then((res) => {
        setPatients(res.data.patients);
        setPageSize(res.data.pageSize);
        setTotalPages(Math.ceil(res.data.total / res.data.pageSize));
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      })
      .finally(() => setLoading(false));
  }, [currentPage, dentistId]);

  const filteredPersons = patients.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <svg className="delete-icon" viewBox="0 0 24 24">
      <path
        d="M10 12V17"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 12V17"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7H20"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

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
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Cargando...
              </td>
            </tr>
          ) : filteredPersons.length > 0 ? (
            filteredPersons.map((person) => (
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
                    onClick={(e) => handleDeleteClick(person.medicalRecord, e)}
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
  );
};

export default PersonTable;
