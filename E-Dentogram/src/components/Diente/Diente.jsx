import { useEffect, useState } from 'react'
import './Diente.css'
import DienteModal from './DienteModal';

function Diente(props){

    const [showModal, toggleModal] = useState(false);
    const [estados, setEstados] = useState({
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY"
    })
    const [upperState, setUpperState] = useState("")
    

    const handleConfirm = (estados,upper) =>{
        setEstados(estados)
        setUpperState(upper)
    }

    /* useEffect(() => {
        if (props.state){
            setEstados(props.state)
            
            const values = Object.values(props.state);
            const firstValue = values[0];
            if (values.every(value => value === firstValue)){
                setUpperSte(firstValue)
            }
        }
    },[]) */

    return(
    <>  
        <div className="diente normal" onClick={() => {toggleModal(!showModal), console.log(estados)}}>
            <div id="vestibular">
              <div className={estados.up}>

              </div>
          </div>
          <div id="distal">
              <div className={estados.left}>
                  
              </div>    
            </div>
          <div id="centro"> 
              <div className={estados.center}>
                  
              </div>
          </div>
          <div id="mesial">
              <div className={estados.right} >
                  
              </div>
          </div>
          <div id="palatino">
              <div  className={estados.down}>
                  
              </div>   
          </div> 
        
          <div className={upperState}></div>

        </div>
        
        

        <DienteModal showModal= {showModal} 
        onClose={() => toggleModal(false)} 
        num={props.num} 
        seccion={props.seccion}
        diente={{...estados,...{upperState: upperState}}}
        submitDiente={handleConfirm}
        />
    </>
    )
}

export default Diente