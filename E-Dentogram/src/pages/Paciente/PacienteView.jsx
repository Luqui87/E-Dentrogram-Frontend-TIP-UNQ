import PacienteCard from "../../components/PacienteCard/PacienteCard";
import Odontograma from "../../components/Odontograma/Odontograma";
import "./PacienteView.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../service/API";
import handleApiError from "../../service/API";
import { toast } from "react-toastify";

function PacienteView() {
  const [patient, setPatient] = useState({
    name: 'Lucas Alvarez',
    medicalRecord: 1234,
    dni: 42594982,
    address: 'Bragado 1947',
    birtdate: '2000-10-12',
    telephone: 1153276406,
    email: 'alvarezlucas2787@gmail.com',
    teeth: []
  });
  const [isLoading, SetLoading] = useState(false);
  const { id } = useParams();
  const [type, setType] = useState("Adulto")

  /* useEffect(() => {
    API.getPatient(id)
      .then((res) => {
        setPatient(res.data);
        SetLoading(false);
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      })
      .finally();
  }, []); */

  return isLoading ? (
    <main style={{ alignItems: "center", justifyContent: "center" }}>
      <span class="loader"></span>
    </main>
  ) : (
    <main>
      <div className="patient-info">
         <PacienteCard patient={patient} />
          <select value={type} onChange={e => setType(e.target.value)} className="classic">
            <option>Adulto</option>
            <option>Infante</option>
            <option>Mixto</option>
          </select>
      </div>
     
      
      <Odontograma type={type} teeth={patient.teeth} />
    </main>
  );
}

export default PacienteView;
