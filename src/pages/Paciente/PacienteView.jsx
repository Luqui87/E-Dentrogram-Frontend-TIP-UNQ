import PacienteCard from "../../components/PacienteCard/PacienteCard";
import Odontograma from "../../components/Odontograma/Odontograma";
import "./PacienteView.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../service/API";
import { handleApiError } from "../../service/API";
import { toast } from "react-toastify";
import Historial from "../../components/Historial/Historial";
import Comparar from "../../components/Comparar/Comparar";

function PacienteView() {
  const [patient, setPatient] = useState({});
  const [isLoading, SetLoading] = useState(true);
  const { id } = useParams();
  const [render, setRender] = useState(false);
  const [type, setType] = useState("Adulto");
  const [activeTab, setActiveTab] = useState("odontograma");

  const [comparacion, setComparacion] = useState([]);

  useEffect(() => {
    API.getPatient(id)
      .then((res) => {
        setPatient(res.data);
        SetLoading(false);
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      })
      .finally();
  }, []);

  return isLoading ? (
    <main style={{ alignItems: "center", justifyContent: "center" }}>
      <span className="loader"></span>
    </main>
  ) : (
    <main>
      <div className="patient-info">
        <PacienteCard patient={patient} />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={`classic ${activeTab == "historial" ? "inactive" : ""}`}
        >
          <option>Adulto</option>
          <option>Infante</option>
          {activeTab !== "comparar" ? <option>Mixto</option> : <></>}
        </select>

        <div className="tab ">
          <button
            className={activeTab === "odontograma" ? "active" : ""}
            onClick={() => setActiveTab("odontograma")}
          >
            Odontograma
          </button>
          <button
            className={activeTab === "historial" ? "active" : ""}
            onClick={() => setActiveTab("historial")}
          >
            Historial
          </button>
          <button
            className={activeTab === "comparar" ? "active" : ""}
            onClick={() => {
              setActiveTab("comparar");
              setType("Adulto");
            }}
          >
            Comparar
          </button>
        </div>
      </div>

      <Odontograma
        type={type}
        teeth={patient.teeth}
        active={activeTab === "odontograma" ? "active" : "inactive"}
        setRecord={() => setRender(!render)}
        hasModal={true}
      />
      <Historial
        rerender={render}
        id={id}
        active={activeTab === "historial" ? "active" : "inactive"}
        setComparacion={setComparacion}
        goToCompareTab={() => setActiveTab("comparar")}
        comparacion={comparacion}
        
      />

      <Comparar
        active={activeTab === "comparar" ? "active" : "inactive"}
        type={type}
        id={id}
        comparacion={comparacion}
        setComparacion={setComparacion}
      />
    </main>
  );
}

export default PacienteView;
