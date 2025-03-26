import { useState } from 'react'
import './Diente.css'
import DienteModal from './DienteModal';

function Diente(props){

    const [showModal, toggleModal] = useState(false);

    return(
    <>    
        <div className="diente normal" onClick={() => toggleModal(!showModal)}>
            <div id="vestibular">
              <div >

              </div>
          </div>
          <div id="distal">
              <div >
                  
              </div>    
            </div>
          <div id="centro"> 
              <div>
                  
              </div>
          </div>
          <div id="mesial">
              <div >
                  
              </div>
          </div>
          <div id="palatino">
              <div  >
                  
              </div>   
          </div> 
        
        </div>
        
        <DienteModal showModal= {showModal} 
        onClose={() => toggleModal(false)} 
        num={props.num} 
        seccion={props.seccion}/>
    </>
    )
}

export default Diente