import { useEffect, useState } from 'react'
import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'
import './Comparar.css'
import DateTimePicker from 'react-datetime-picker'
import API, { handleApiError } from '../../service/API'
import { toast } from 'react-toastify'

function Comparar({active, type, id, comparacion, setComparacion}){
    const [firstDate, setFirstDate] = useState();
    const [secondDate, setSecondDate] = useState();
    const [firstLoading, setFirstLoading] = useState(true);
    const [secondLoading, setSecondLoading] = useState(true);

    const [firstOdontogram, setFirstOdontogram] = useState([]);
    const [secondOdontogram, setSecondOdontogram] = useState([]);

    const [hovering, setHovering] = useState("#ffffff");
    
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
        .catch((error) =>{
            toast.error(handleApiError(error))
            
        })

      setSecondDate(second);

      API.getTeethAtDate(id, toLocalDateTimeString(second))
      .then((res) => {
          const changes = checkForChanges(res.data, firstTeeth);
          setSecondOdontogram(changes);
          setSecondLoading(false);
      })
      .catch((error) =>{
            toast.error(handleApiError(error))
        })


    }

    const handleFirstOdontogram = (date) => {

        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        
        setFirstDate(date);

        API.getTeethAtDate(id, toLocalDateTimeString(date))
        .then((res) => {
            setFirstOdontogram(res.data);
            setFirstLoading(false);
        })
        .catch((error) =>{
            toast.error(handleApiError(error))
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

        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);

        if (!firstDate){
            toast.warning("Seleccionar primer fecha");
            return
        }

        if (date < firstDate){
            toast.warning("La segunda fecha seleccionada debe ser posterior a la primera");
            return;
        }

        setSecondDate(date);

        API.getTeethAtDate(id, toLocalDateTimeString(date))
        .then((res) => {
            const changes = checkForChanges(res.data, firstOdontogram);
            console.log(changes)
            setSecondOdontogram(changes);
            setSecondLoading(false);
        })
        .catch((error) =>{
            toast.error(handleApiError(error))
        })
    }

    const resetCompare = () => {
        setComparacion([]);
        setFirstDate(null);
        setFirstLoading(true);
        setSecondDate(null);
        setSecondLoading(null);
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
                : <DateTimePicker data-testid='date-picker-before' locale="es-ES" format="dd/MM/y HH:mm" value={firstDate} onChange={(d) => handleFirstOdontogram(d)}/> }
            </div>


            <div className='middle'>
                <hr />
                    <svg data-testid="reset-button"
                    onClick={() => resetCompare()} 
                    onMouseEnter={()=> setHovering("grey")}
                    onMouseLeave={() => setHovering("#ffffff")}
                    onMouseDown={() => setHovering("black")}
                    onMouseUp={() => setHovering("grey")}
                    viewBox="-2.4 -2.4 28.80 28.80" className='reset-icon' fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#95b6bd" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"><rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="14.4" fill="#95b6bd" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_1276_7761)"> <path d="M19.7285 10.9288C20.4413 13.5978 19.7507 16.5635 17.6569 18.6573C15.1798 21.1344 11.4826 21.6475 8.5 20.1966M18.364 8.05071L17.6569 7.3436C14.5327 4.21941 9.46736 4.21941 6.34316 7.3436C3.42964 10.2571 3.23318 14.8588 5.75376 18M18.364 8.05071H14.1213M18.364 8.05071V3.80807" stroke={hovering} stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0_1276_7761"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                <hr />
            </div>

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
                :<DateTimePicker data-testid='date-picker-after' locale="es-ES" format="dd/MM/y HH:mm" value={secondDate} onChange={(d) => handleSecondontogram(d)}/> }
            </div>
                        
        </div>
    )
}

export default Comparar;
