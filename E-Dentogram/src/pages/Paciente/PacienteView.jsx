import PacienteCard from "../../components/PacienteCard/PacienteCard";
import Odontograma from "../../components/Odontograma/Odontograma";
import "./PacienteView.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../service/API";
import handleApiError from "../../service/API";
import { toast } from "react-toastify";
import Historial from "../../components/Historial/Historial";

function PacienteView() {
  const [patient, setPatient] = useState({});
  const [isLoading, SetLoading] = useState(true);
  const { id } = useParams();
  const [patientId, setId] = useState("")
  const [type, setType] = useState("Adulto")
  const [record, setRecord] = useState({})

  const [activeTab, setActiveTab] = useState("odontograma");


  useEffect(() => {
    
    API.getPatient(id)
    .then((res) => {
      setPatient(res.data)
      setId(id)
      SetLoading(false)
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
          <select value={type} onChange={e => setType(e.target.value)} className={`classic ${activeTab !== "odontograma" ? "inactive" : ""}`}>
            <option>Adulto</option>
            <option>Infante</option>
            <option>Mixto</option>
          </select>

          <div className="tab " >
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
          </div>
      </div>
     
      
      <Odontograma type={type} teeth={patient.teeth} active={activeTab === "odontograma" ? "active" : "inactive"} setRecord={() => setId(id)}/> 
      <Historial record={record} id={patientId} active={activeTab === "historial" ? "active" : "inactive"}/>        
    </main>
  );
}

export default PacienteView;
