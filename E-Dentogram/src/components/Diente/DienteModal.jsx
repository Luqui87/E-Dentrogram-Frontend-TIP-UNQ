import './DienteModal.css';
import Modal from '../Modal';
import {useParams} from 'react-router-dom';
import { useEffect, useState} from 'react'
import API from '../../service/API';
import { ToastContainer, toast, Bounce } from 'react-toastify';

function DienteModal(props){

    const [vestibular, setVestibular] = useState("");
    const [distal, setDistal] = useState("");
    const [centro, setCentro] = useState("");
    const [mesial, setMesial] = useState("");
    const [palatino, setPalatino] = useState("");
    const [selected, setSelected] = useState("");

    const { id } = useParams()

    const number = props.seccion < 5 ? (props.seccion - 1 ) * 8  + props.num: 32 + (props. seccion - 5 ) * 5 + props.num 


    useEffect(()=>{
        setVestibular(props.diente.up);
        setDistal(props.diente.left);
        setCentro(props.diente.center);
        setMesial(props.diente.right);
        setPalatino(props.diente.down);
    },[props.diente.up, props.diente.left, props.diente.center, props.diente.right,props.diente.down])


    const clearSelected = () => {
        setVestibular(vestibular.replaceAll(" selected", ""));
        setDistal(distal.replaceAll(" selected", ""));
        setCentro(centro.replaceAll(" selected", ""));
        setMesial(mesial.replaceAll(" selected", ""));
        setPalatino(palatino.replaceAll(" selected", ""));

    }

    const handleSelect = ( parte, stateHandler ) => {     
        
        clearSelected();

        stateHandler(parte + ' selected' );
        
        setSelected(()=> stateHandler)


    }
    

    const handleConfirm = () => {
        
        clearSelected()

        if ([vestibular, mesial, palatino, distal, centro].some(e=> !e.includes("HEALTHY"))){

            const putTooth = [{
                number: number,
                up: vestibular.replaceAll(" selected", ""),
                right: mesial.replaceAll(" selected", ""),
                down: palatino.replaceAll(" selected", ""),
                left: distal.replaceAll(" selected", ""),
                center: centro.replaceAll(" selected", "")
            }]
            

            API.updateTeeth(id, putTooth)
            .then(() =>{

                props.submitDiente({
                    up: vestibular,
                    left: distal,
                    center: centro,
                    right: mesial,
                    down: palatino
                });
                props.onClose()
                toast.success("Cambios confirmados") 
            })
            .catch(error => {
                toast.error("Cambios no confirmados")
                console.log(error)
            })
                
        } else{

        }
        
    }

    return(
        <Modal isOpen={props.showModal} onClose={props.onClose}>
            <div className="modalDiente">
                <h1>Diente {props.seccion} {props.num}</h1>
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
                    
                    </div>

                    <div className="prestaciones">
                        <div className="btn-group" style={{display:'flex', width:'100%'}}>
                            <button className='CARIES' onClick={() => selected("CARIES")}>Carie</button>
                            <button className='RESTORATION' onClick={() => selected("RESTORATION")}>Restauracion</button>
                        </div>
                        <button className='button' onClick={()=> handleConfirm()}>Confirmar</button>
                    </div>    

                    
                </div>
                
            </div>
            
           

        </Modal>
    )
}

export default DienteModal