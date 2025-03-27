import { useState } from 'react'
import './Diente.css'
import DienteModal from './DienteModal';

function Diente(props){

    const [showModal, toggleModal] = useState(false);
    const [estados, setEstados] = useState({
        vestibular:"",
        distal:"",
        centro:"",
        mesial:"",
        palatino:""
    })

    return(
    <>    
        <div className="diente normal" onClick={() => toggleModal(!showModal)}>
            <div id="vestibular">
              <div className={estados.vestibular}>

              </div>
          </div>
          <div id="distal">
              <div className={estados.distal}>
                  
              </div>    
            </div>
          <div id="centro"> 
              <div className={estados.centro}>
                  
              </div>
          </div>
          <div id="mesial">
              <div className={estados.mesial} >
                  
              </div>
          </div>
          <div id="palatino">
              <div  className={estados.palatino}>
                  
              </div>   
          </div> 
        
        </div>
        
        <DienteModal showModal= {showModal} 
        onClose={() => toggleModal(false)} 
        num={props.num} 
        seccion={props.seccion}
        diente={estados}
        submitDiente={setEstados}
        />
    </>
    )
}

export default Diente