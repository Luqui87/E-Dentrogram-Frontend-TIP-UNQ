import { useEffect, useState } from 'react'
import './Diente.css'
import DienteModal from './DienteModal';
import { States } from './States';

function Diente(props){

    const [showModal, toggleModal] = useState(false);
    const [estados, setEstados] = useState({
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "NOTHING"
    })
    const [upperState, setUpperState] = useState("");
    const [hasChanged, setHasChanged] = useState("");
    

    const handleConfirm = (change) =>{
        const {number, ...rest} = change
        setEstados(rest)
        
        setUpperState(getUpperState(rest))

        props.setRecord()
    }
    

    const getUpperState = (estados) => {
        const {special, ...rest} = estados

        const values = Object.values(rest);
        const firstValue = values[0];

        return values.every(value => value === firstValue) && !["HEALTHY", "RESTORATION", "CARIES","HEALTHFUL"].includes(firstValue) ? firstValue : special
        
    }
    

    useEffect(() => {
        if (props.state){
            const {change, ...states} = props.state;

            setHasChanged(change);

            setEstados(states);
            const { number, ...rest } = states;
                
            setUpperState(getUpperState(rest) )
        }
    },[]) 

    return(
    <>
        <div className={`${hasChanged} diente normal`} onClick={() => toggleModal(!showModal)}>
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
        
          {States[upperState]}

        </div>
        

        {props.seccion && 
        <DienteModal showModal= {showModal} 
        onClose={() => toggleModal(false)} 
        num={props.num} 
        seccion={props.seccion}
        diente={{...estados,...{upperState: upperState}}}
        submitDiente={handleConfirm}
        />
        }
        
    </>
    )
}

export default Diente