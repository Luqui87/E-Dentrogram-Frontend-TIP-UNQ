import { useState } from 'react'
import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'
import './Comparar.css'
import DateTimePicker from 'react-datetime-picker'
import API from '../../service/API'

function Comparar({active, type, id}){
    const [firstDate, setFirstDate] = useState();
    const [secondDate, setSecondDate] = useState();
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)

    const [firstOdontogram, setFirstOdontogram] = useState([])
     const [secondOdontogram, setSecondOdontogram] = useState([])


    const handleChange = (date, setDate, setOdontogram, SetLoading) => {
        
        setDate(date.toLocaleDateString());

        API.getTeethAtDate(id, date.toLocaleDateString())
        .then((res) => {
            setOdontogram(res.data)
            SetLoading(false)
        })


  };

    return(
        <div className={`${active} Comparar`}>
            <div className="before">
                <h2>Odontograma a la fecha {firstDate}</h2>
                {firstDate? 
                <>
                {firstLoading ?  
                    <span className="loader"></span>
                    :                        
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={firstOdontogram}/> 
                        }
                </>
                :<DateTimePicker value={firstDate} onChange={(d) =>handleChange(d,setFirstDate, setFirstOdontogram, setFirstLoading)}/> }
            </div>
            <hr />
            <div className='after'>
                <h2>Odontograma a la fecha {secondDate}</h2>
                {secondDate? 
                <>
                {secondLoading ?  
                    <span className="loader"></span>
                    :                        
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={secondOdontogram}/> 
                        }
                </>
                :<DateTimePicker value={secondDate} onChange={(d) => handleChange(d,setSecondDate, setSecondOdontogram, setSecondLoading)}/> }
            </div>
                        
        </div>
    )
}

export default Comparar
