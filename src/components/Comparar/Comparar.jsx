import { useState } from 'react'
import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'


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

function Comparar(){

    const [type,setType] = useState("Adulto")

    return(
        <Modal isOpen={true} >
            <h1>Modificaciones de odontograma</h1>
            <select value={type} onChange={e => setType(e.target.value)} className="classic" style={{right:"15px", top:"10px"}}>
                <option>Adulto</option>
                <option>Infante</option>
          </select>
            <h2 style={{margin:"auto"}}>Version en la fecha 20/05</h2>
            <Odontograma type={`${type} Comparar`} active={'active'} teeth={mockedTeeth} />
            <hr style={{height: "5px", backgroundColor: "black"}} />

            <h2>Version en la fecha 05/06 </h2>
            <Odontograma type={`${type} Comparar`} active={'active'} teeth={mockedTeeth} />
        </Modal>
    )
}

export default Comparar
