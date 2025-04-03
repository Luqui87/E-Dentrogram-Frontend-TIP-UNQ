import PacienteCard from '../../components/PacienteCard/PacienteCard'
import Odontograma from '../../components/Odontograma/Odontograma'
import './PacienteView.css'
import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../service/API';

function PacienteView(){
    const [patient, setPatient] = useState("")
    const [isLoading, SetLoading] = useState(true)
    const { id } = useParams()

    useEffect(()=>{
        API.getPatient(id)
        .then((res) => setPatient(res.data))
        .finally(() => SetLoading(false))
    }, [])
    
    return(
        isLoading ? <></> :
        <main>
            <PacienteCard patient={patient}/>
            <Odontograma teeth={patient.teeth}/> 
        </main>
    )
}

export default PacienteView