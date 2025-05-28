import { useState } from "react"
import Diente from "../Diente/Diente"
import './Historial.css'

function Historial({active}){

    const [cambios, setCambios] = useState([{
        fecha: Date.now(),
        diente: '1 3',
        antes: {},
        despues: {},
        dentista: "Lucas Alvarez"
    },
    {
        fecha: Date.now(),
        diente: '1 4',
        antes: {},
        despues: {
            		"number": 9,
		"up": "MISSING",
		"right": "MISSING",
		"down": "MISSING",
		"left": "MISSING",
		"center": "MISSING",
		"special": "NOTHING"
        },
        dentista: "Lucas Alvarez"
    }])

    return(
    <div className={`historial ${active}`}>
        <div className="table-container">
            <table className="person-table">
                <thead>
                <tr>
                    <th></th>
                    <th>Fecha</th>
                    <th>Diente</th>
                    <th>Antes</th>
                    <th>Despues</th>
                    <th>Dentista</th>
                </tr>
                </thead>
                <tbody>
                {cambios.map((cambio) => (
                    <tr
                    key={cambio.diente}
                    
                    >
                        <td></td>
                        <td>{cambio.fecha}</td>
                        <td>{cambio.diente}</td>
                        <td><Diente state={cambio.antes}/> </td>
                        <td><Diente state={cambio.despues}/></td>
                        <td>{cambio.dentista}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    </div>
    )
}

export default Historial