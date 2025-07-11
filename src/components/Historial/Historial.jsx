import { useEffect, useState } from "react";
import Diente from "../Diente/Diente";
import "./Historial.css";
import API from "../../service/API";

function Historial({ active, id, rerender, setComparacion, goToCompareTab, comparacion }) {
  const [changes, setChanges] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedRecords, setSelectedRecords] = useState([]);

    useEffect(() => {
    if (id) {
      fetchPage(0);
      setSelectedRecords([]);
    }
    }, [rerender, comparacion]);


  const formatDate = (date) => {
    const fecha = new Date(date.replace(/(\.\d{3})\d*/, "$1"));

    const formateada = fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formateada;
  };

  const formatNumero = (numero) => {
    if (numero <= 4 * 8) {
      // Secciones 1 a 4
      const seccion = Math.ceil(numero / 8);
      const orden = numero - (seccion - 1) * 8;
      return `${seccion} ${orden}`;
    } else {
      // Secciones 5 a 8
      const numeroRelativo = numero - 4 * 8;
      const seccion = 4 + Math.ceil(numeroRelativo / 5);
      const orden = numeroRelativo - (Math.ceil(numeroRelativo / 5) - 1) * 5;
      return `${seccion} ${orden}`;
    }
  };

  const pageSize = 10;

  const fetchPage = (pageNumber) => {
    setLoading(true);

    API.getPatientRecord(id, pageNumber)
      .then((res) => {
        const { records, total } = res.data;

        setChanges(records);
        setTotalPages(Math.ceil(total / pageSize));
        setPage(pageNumber);
      })
      .catch((error) => {
        console.error("Error al obtener historial:", error);
        setChanges([]);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleSelection = (record) => {
    setSelectedRecords((prev) => {
      const exists = prev.find((r) => r.date === record.date);

      if (exists) {
        return prev.filter((r) => r.date !== record.date);
      } else if (prev.length < 2) {
        const updated = [...prev, record];
        return updated.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (selectedRecords.length === 2) {
      setComparacion(selectedRecords);
      goToCompareTab();
    }
  };

  const handlePageClick = (num) => {
    if (num !== page && num >= 0 && num < totalPages) {
      fetchPage(num);
    }
  };

  const renderPagination = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${i === page ? "active" : ""}`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="nav-btn"
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 0}
        >
          « Anterior
        </button>
        {buttons}
        <button
          className="nav-btn"
          onClick={() => handlePageClick(page + 1)}
          disabled={page === totalPages - 1}
        >
          Siguiente »
        </button>
      </div>
    );
  };

  const renderChanges = () => {
  return changes.length > 0 ? (
    changes.map((cambio) => {
      const key = cambio.date;
      const isSelected = selectedRecords.some((r) => r.date === cambio.date);

      return (
        <tr
          key={key}
          data-testid={key}
          className={isSelected ? "selected" : ""}
          onClick={() => toggleSelection(cambio)}
          style={{ cursor: "pointer" }}
        >
          <td>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelection(cambio)}
              onClick={(e) => e.stopPropagation()}
            />
          </td>
          <td>{formatDate(cambio.date)}</td>
          <td>{formatNumero(cambio.tooth_number)}</td>
          <td>
            <Diente
              state={{
                up: cambio.before[0],
                right: cambio.before[1],
                down: cambio.before[2],
                left: cambio.before[3],
                center: cambio.before[4],
                special: cambio.before[5],
              }}
            />
          </td>
          <td>
            <Diente
              state={{
                up: cambio.after[0],
                right: cambio.after[1],
                down: cambio.after[2],
                left: cambio.after[3],
                center: cambio.after[4],
                special: cambio.after[5],
              }}
            />
          </td>
          <td>{cambio.dentistName}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: "center" }}>
        {loading ? "Cargando..." : "No hay registros disponibles."}
      </td>
    </tr>
  );
};


  return (
    <div className={`historial ${active}`}>
      <div className="table-container">
        <table className="person-table">
          <thead>
            <tr>
              <th></th>
              <th>Fecha</th>
              <th>Diente</th>
              <th>Antes</th>
              <th>Después</th>
              <th>Dentista</th>
            </tr>
          </thead>
          <tbody>
            {renderChanges()}
          </tbody>
        </table>
        {selectedRecords.length === 2 && (
          <div className="compare-button-container">
            <button className="compare-button" onClick={handleCompare}>
              Comparar
            </button>
          </div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
}

export default Historial;
