import { useState } from 'react'
import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'
import './Comparar.css'
import DateTimePicker from 'react-datetime-picker'


const mockedTeeth = [
        {
        up:"MISSING",
        left:"MISSING",
        center:"MISSING",
        right:"MISSING",
        down:"MISSING",
        special: "NOTHING",
        number: 1
        },
        {
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT",
        number: 52
        },
    ]

function Comparar({active, type}){
    const [firstDate, setFirstDate] = useState();
    const [secondDate, setSecondDate] = useState();
    const [firstLoading, setFirstLoading] = useState(true)
    const [secondLoading, setSecondLoading] = useState(true)

    const handleChange = (date, setFunction) => {
        
        setFunction(date.toLocaleDateString());
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
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={mockedTeeth}/> 
                        }
                </>
                :<DateTimePicker value={firstDate} onChange={(d) =>handleChange(d,setFirstDate)}/> }
            </div>
            <hr />
            <div className='after'>
                <h2>Odontograma a la fecha {secondDate}</h2>
                {secondDate? 
                <>
                {secondLoading ?  
                    <span className="loader"></span>
                    :                        
                        <Odontograma type={`${type} Comparar`} active={'active'} teeth={mockedTeeth}/> 
                        }
                </>
                :<DateTimePicker value={secondDate} onChange={(d) => handleChange(d,setSecondDate)}/> }
            </div>
                        
        </div>
    )
}

export default Comparar
