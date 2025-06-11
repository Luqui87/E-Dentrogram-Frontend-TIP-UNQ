import { useEffect, useState } from 'react'
import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'
import './Comparar.css'
import DateTimePicker from 'react-datetime-picker'
import API from '../../service/API'
import { toast } from 'react-toastify'

function Comparar({active, type, id, comparacion}){
    const [firstDate, setFirstDate] = useState();
    const [secondDate, setSecondDate] = useState();
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)

    const [firstOdontogram, setFirstOdontogram] = useState([])
    const [secondOdontogram, setSecondOdontogram] = useState([])

    
    useEffect(() => {
    if (comparacion?.length === 2) {
      const first = new Date(comparacion[0].date);
      const second = new Date(comparacion[1].date);
      
      handleCompare(first,second);
        }
      }, [comparacion]);
    


    function toLocalDateTimeString(fecha) {
      const pad = n => String(n).padStart(2, '0');
      const padMs = n => String(n).padStart(3, '0');

      const anio = fecha.getFullYear();
      const mes = pad(fecha.getMonth() + 1);
      const dia = pad(fecha.getDate());

      const horas = pad(fecha.getHours());
      const minutos = pad(fecha.getMinutes());
      const segundos = pad(fecha.getSeconds());
      const milisegundos = padMs(fecha.getMilliseconds() + 1);

      return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milisegundos}`;
    }

    const handleCompare = (first, second) => {
      
      setFirstDate(first);
      
      let firstTeeth = [];

      API.getTeethAtDate(id, toLocalDateTimeString(first))
        .then((res) => {
            setFirstOdontogram(res.data);
            setFirstLoading(false);
            firstTeeth = res.data;
        })

      setSecondDate(second);

      API.getTeethAtDate(id, toLocalDateTimeString(second))
      .then((res) => {
          const changes = checkForChanges(res.data, firstTeeth);
          setSecondOdontogram(changes);
          setSecondLoading(false);
      })


    }

    const handleFirstOdontogram = (date) => {
        
        setFirstDate(date);

        API.getTeethAtDate(id, date.toISOString().split('T')[0])
        .then((res) => {
            setFirstOdontogram(res.data);
            setFirstLoading(false);
        })

  };

    const checkForChanges = (teeth, beforeTeeth) => {
        return teeth.map((tooth) => {

            const before = beforeTeeth.find(t => t.number === tooth.number);

            const hasChanged = JSON.stringify(tooth) !== JSON.stringify(before);

            return hasChanged ? { ...tooth, change: "change" } : tooth;
        });
    };

  const handleSecondontogram = (date) =>{

        if (date < firstDate){
            toast.warning("La segunda fecha seleccionada debe ser posterior a la primera");
            return;
        }

        setSecondDate(date);

        API.getTeethAtDate(id, date.toISOString().split('T')[0])
        .then((res) => {
            const changes = checkForChanges(res.data, firstOdontogram);
            setSecondOdontogram(changes);
            setSecondLoading(false);
        })
    }

    return(
        <div className={`${active} Comparar`}>
            <div className="before">
                <h2>Odontograma a la fecha {firstDate?.toLocaleDateString()}</h2>
                {firstDate? 
                <>
                {firstLoading ?  
                    <span className="loader"></span>
                    :                        
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={firstOdontogram}/> 
                        }
                </>
                :<DateTimePicker value={firstDate} onChange={(d) => handleFirstOdontogram(d)}/> }
            </div>
            <hr />
            <div className='after'>
                <h2>Odontograma a la fecha {secondDate?.toLocaleDateString()}</h2>
                {secondDate? 
                <>
                {secondLoading ?  
                    <span className="loader"></span>
                    :                        
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={secondOdontogram}/> 
                        }
                </>
                :<DateTimePicker value={secondDate} onChange={(d) => handleSecondontogram(d)}/> }
            </div>
                        
        </div>
    )
}

export default Comparar;
