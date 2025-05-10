import './DienteModal.css';
import Modal from '../Modal';
import {useParams} from 'react-router-dom';
import { useEffect, useState} from 'react'
import API from '../../service/API';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import DienteEstado from './DienteEstado';
import { States } from './States';
import handleApiError from "../../service/API";

function DienteModal(props){

    const [vestibular, setVestibular] = useState("");
    const [distal, setDistal] = useState("");
    const [centro, setCentro] = useState("");
    const [mesial, setMesial] = useState("");
    const [palatino, setPalatino] = useState("");
    const [special, setSpecial] = useState("")


    const [selected, setSelected] = useState(null);
    const [showPrestaciones, setShowPrestaciones] = useState(false)

    const [upperState, setUpperState] = useState("")

    const { id } = useParams()

    const number = props.seccion < 5 ? (props.seccion - 1 ) * 8  + props.num: 32 + (props. seccion - 5 ) * 5 + props.num 


    useEffect(()=>{
        setVestibular(props.diente.up);
        setDistal(props.diente.left);
        setCentro(props.diente.center);
        setMesial(props.diente.right);
        setPalatino(props.diente.down);
        setSpecial(props.diente.special)
        setUpperState(props.diente.upperState);
    },[props.diente.up, props.diente.left, props.diente.center, props.diente.right,props.diente.down])


    const clearSelected = () => {
        setVestibular(vestibular.replaceAll(" selected", ""));
        setDistal(distal.replaceAll(" selected", ""));
        setCentro(centro.replaceAll(" selected", ""));
        setMesial(mesial.replaceAll(" selected", ""));
        setPalatino(palatino.replaceAll(" selected", ""));

    }

    const canBeSelected = (parte) => {
        return parte.includes("HEALTHY") || parte.includes("CARIES") || parte.includes("RESTORATION") || parte.includes("HEALTHFUL")
    }

    const handleSelect = ( parte, stateHandler ) => {     
        
        if (parte.includes("selected")){
            clearSelected()
            setShowPrestaciones(false)
            return
        }

        if (canBeSelected(parte)){
            clearSelected()
            stateHandler(parte + ' selected' );
        
            setSelected({parte, stateHandler});

            setShowPrestaciones(true)

        }

    }

    const handlePrestacion = (prestacion) => {


        setShowPrestaciones(false);
        
        if (selected.parte.includes(prestacion)){
            selected.stateHandler("HEALTHY");
        }
        else{
            selected.stateHandler(prestacion)
        }

    }
    

    const handleTotalState = (newState) => {

        clearSelected();

        setSelected(null)
        setShowPrestaciones(false)
        
        setUpperState(newState);
        setVestibular(newState);
        setDistal(newState);
        setCentro(newState);
        setMesial(newState);
        setPalatino(newState);

        setSpecial("NOTHING")

    }

    const handleSpecialState = (newState) => {
        clearSelected();
        setShowPrestaciones(false)

        setSpecial(newState)

        setUpperState("HEALTHFUL");
        setVestibular("HEALTHFUL");
        setDistal("HEALTHFUL");
        setCentro("HEALTHFUL");
        setMesial("HEALTHFUL");
        setPalatino("HEALTHFUL");

        setUpperState(newState)
    }

    const handleConfirm = () => {
        
        clearSelected()
        setShowPrestaciones(false)

        if ([vestibular, mesial, palatino, distal, centro].some(e=> !e.includes("HEALTHY")) || special != "NOTHING"){

            const putTooth = {
                number: number,
                up: vestibular.replaceAll(" selected", ""),
                right: mesial.replaceAll(" selected", ""),
                down: palatino.replaceAll(" selected", ""),
                left: distal.replaceAll(" selected", ""),
                center: centro.replaceAll(" selected", ""),
                special: special
            }
            

            API.updateTeeth(id, putTooth)
            .then(() =>{

                props.submitDiente({
                    up: vestibular,
                    left: distal,
                    center: centro,
                    right: mesial,
                    down: palatino,
                    special: special
                }, upperState);

                props.onClose()
                toast.success("Cambios confirmados") 
            })
            .catch((error) => {
                toast.error(handleApiError(error));
                
              })
        } else{

        }
        
    }

    return(
        <Modal isOpen={props.showModal} onClose={props.onClose}>
            <div className="modalDiente">
                <span style={{fontSize:"2em", borderBottom:"1px solid grey"}}> <b>Diente {props.seccion} {props.num}</b></span>
                <div className="cuerpo">
                    <div className="diente">
                        <div id="vestibular"  >
                            <div className={vestibular} onClick={() => handleSelect( vestibular, setVestibular)}>

                            </div>
                        </div>
                        <div id="distal">
                            <div className={distal} onClick={() => handleSelect( distal, setDistal)}>
                                
                            </div>    
                            </div>
                        <div id="centro"> 
                            <div className={centro} onClick={() => handleSelect( centro, setCentro)}>
                                
                            </div>
                        </div>
                        <div id="mesial">
                            <div className={mesial} onClick={() => handleSelect( mesial, setMesial)}>
                                
                            </div>
                        </div>
                        <div id="palatino">
                            <div className={palatino} onClick={() => handleSelect( palatino,  setPalatino)} >
                                
                            </div>   
                        </div> 

                        {States[upperState]}
                    
                    </div>

                    <div className="prestaciones">
                        {showPrestaciones && 

                        <div className="btn-group" style={{display:'flex', width:'100%'}}>
                            <button className='CARIES' onClick={() => handlePrestacion("CARIES")}>Carie</button>
                            <button className='RESTORATION' onClick={() => handlePrestacion("RESTORATION")}>Restauracion</button>
                            
                        </div>
                        }
                        <div className="states">
                            <DienteEstado name="Saludable" state="HEALTHY" stateHandler = {() => handleTotalState("HEALTHFUL")}/>
                            <DienteEstado name="Extracción" state="EXTRACTION" stateHandler = {() => handleTotalState("EXTRACTION")}/>
                            <DienteEstado name="Ausente" state="MISSING" stateHandler = {() => handleTotalState("MISSING")}/>
                            <DienteEstado name="Ausente (Por no Erupción)" state="MISSING_NO_ERUPTION" stateHandler = {() => handleTotalState("MISSING_NO_ERUPTION")}/>
                            <DienteEstado name="A Erupcionar" state="TO_ERUPT" stateHandler = {() => handleTotalState("TO_ERUPT")}/>
                            <DienteEstado name="Implante" state="IMPLANT" stateHandler = {() => handleTotalState("IMPLANT")} propColor={"red"}/>
                            <DienteEstado name="Corona" state="DENTAL_CROWNS" stateHandler = {() => handleSpecialState("DENTAL_CROWNS")}/>
                            <DienteEstado name="Corona Filtrada" state="DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT" stateHandler = {() => handleSpecialState("DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT")}/>
                        </div>
                        <div></div>


                        <button className='button' onClick={()=> handleConfirm()}>Confirmar</button>
                    </div>    

                    
                </div>
                
            </div>
            
           

        </Modal>
    )
}

export default DienteModal