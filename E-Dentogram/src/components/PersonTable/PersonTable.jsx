import React from "react";
import { useNavigate } from "react-router-dom";
import "./PersonTable.css";

const PersonTable = ({ patients, searchTerm, setPatients }) => {
  const navigate = useNavigate();

  const filteredPersons = patients.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/paciente/${id}`); // cambiar id por medicalRecord
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Evita que se active el handleRowClick
    setPatients((prevPatients) =>
      prevPatients.filter((person) => person.medicalRecord !== id)
    );
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
                  onClick={(event) => handleDelete(person.medicalRecord, event)} // cambiar por un endpoint de sacarlo del medico
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonTable;
