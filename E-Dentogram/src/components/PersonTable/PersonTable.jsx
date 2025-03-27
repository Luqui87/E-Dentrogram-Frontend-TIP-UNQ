import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonTable.css";

const initialPersons = [
  {
    id: 1,
    name: "Lucas Alvarez",
    history: "312312",
    dni: "42.594.982",
    phone: "+1153276406",
  },
  {
    id: 2,
    name: "Maria Perez",
    history: "123456",
    dni: "40.123.456",
    phone: "+54112345678",
  },
  {
    id: 3,
    name: "Juan Garcia",
    history: "654321",
    dni: "38.654.321",
    phone: "+54119876543",
  },
];

const PersonTable = ({ searchTerm }) => {
  const [persons, setPersons] = useState(initialPersons);
  const navigate = useNavigate();

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/person/${id}`); // Cambiar
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Evita que se active el handleRowClick
    setPersons(persons.filter((person) => person.id !== id));
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
            <tr key={person.id} onClick={() => handleRowClick(person.id)}>
              <td>{person.name}</td>
              <td>{person.history}</td>
              <td>{person.dni}</td>
              <td>{person.phone}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={(event) => handleDelete(person.id, event)}
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
