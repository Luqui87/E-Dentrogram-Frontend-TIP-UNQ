import PacienteCard from '../../components/PacienteCard/PacienteCard'
import Odontograma from '../../components/Odontograma/Odontograma'
import './PacienteView.css'
import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';

function PacienteView(){
    const [patient, setPatient] = useState("")
    const [isLoading, SetLoading] = useState(true)
    const { id } = useParams()

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/patient/${id}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    mode: "cors"
                });
                const result = await response.json();
                setPatient(result)
                SetLoading(false)

            } catch (error){
                console.log(error);
            }
        };

        fetchData();
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