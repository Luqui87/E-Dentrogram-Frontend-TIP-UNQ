import { useEffect } from 'react'
import Diente from '../Diente/Diente'
import './Odontograma.css'

function Odontograma( {type,teeth, active, setRecord} ){

    function dientes(n, seccion){

        const initial = seccion < 5 ? (seccion - 1 ) * 8 : 32 + (seccion - 5 ) * 5  ;

        return [...Array(n)].map((e, i) => 
            <div className='fila' key={initial + i}>
                {/* <span>{i + 1}</span> */}
                <Diente seccion={seccion} num={i + 1}
                state={ teeth.find((tooth) => tooth.number ==  initial +  (i + 1 )  )}
                setRecord={setRecord}/>
            </div>
        )
    }

    return (
            <div className={`odontograma ${type} ${active}`}>
                
                <div className={`seccion adulto ${type}`}>
                    <div className="dientes">
                        {dientes(8,1)}
                        {/* <span>1</span> */}
                    </div>
                    
                    <div className="dientes">
                        {dientes(8,2)}
                        {/* <span>2</span> */}
                    </div>
                </div>
                
                <div className={`seccion infante ${type}`}>
                    <div className="dientes">
                        {dientes(5,5)}
                        {/* <span>5</span> */}
                    </div>
                    <div className="dientes">
                        {dientes(5,6)}
                        {/* <span>6</span> */}
                    </div>
                </div>
                
                <div className={`seccion infante ${type}`}>
                    <div className="dientes">
                        {dientes(5,8)}
                        {/* <span>8</span> */}
                    </div>
                    <div className="dientes">
                        {dientes(5,7)}
                        {/* <span>7</span> */}
                    </div>
                </div>    
            
                <div className={`seccion adulto ${type}`}>
                    <div className="dientes">
                        {dientes(8,4)}
                        {/* <span>4</span> */}
                    </div>
                    <div className="dientes">
                        {dientes(8,3)}
                        {/* <span>3</span> */}
                    </div>
                </div>
            
        </div>
        
    )
    
}

export default Odontograma

