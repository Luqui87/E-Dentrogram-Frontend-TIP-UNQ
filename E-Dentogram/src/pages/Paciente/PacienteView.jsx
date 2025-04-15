import PacienteCard from '../../components/PacienteCard/PacienteCard'
import Odontograma from '../../components/Odontograma/Odontograma'
import './PacienteView.css'
import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../service/API';
import { toast } from 'react-toastify';

function PacienteView(){
    const [patient, setPatient] = useState("")
    const [isLoading, SetLoading] = useState(true)
    const { id } = useParams()

    useEffect(()=>{
        API.getPatient(id)
        .then((res) => {
            setPatient(res.data);
            SetLoading(false);
        })
        .catch(error=>{
            toast.error("No se pudo cargar el paciente")
            console.log(error)
        })
        .finally()
    }, [])
    
    return(
        isLoading ? 
        <main style={{alignItems:"center", justifyContent:"center"}}>
            <span  class="loader"></span>
        </main> 
        :
        <main>
            <PacienteCard patient={patient}/>
            <Odontograma teeth={patient.teeth}/> 
        </main>
    )
}

export default PacienteView