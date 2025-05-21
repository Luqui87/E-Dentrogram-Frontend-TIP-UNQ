import PacienteCard from "../../components/PacienteCard/PacienteCard";
import Odontograma from "../../components/Odontograma/Odontograma";
import "./PacienteView.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../service/API";
import handleApiError from "../../service/API";
import { toast } from "react-toastify";

function PacienteView() {
  const [patient, setPatient] = useState("");
  const [isLoading, SetLoading] = useState(true);
  const { id } = useParams();

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
      <span class="loader"></span>
    </main>
  ) : (
    <main>
      <div className="patient-info">
         <PacienteCard patient={patient} />
          <select className="classic">
            <option>Adulto</option>
            <option>Infante</option>
            <option>Mixto</option>
          </select>
      </div>
     
      
      <Odontograma teeth={patient.teeth} />
    </main>
  );
}

export default PacienteView;
