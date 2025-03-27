import './DienteModal.css'
import Modal from '../Modal'
import { useState } from 'react'

function DienteModal(props){

    const [vestibular, setVestibular] = useState(props.diente.vestibular);
    const [distal, setDistal] = useState(props.diente.distal);
    const [centro, setCentro] = useState(props.diente.centro);
    const [mesial, setMesial] = useState(props.diente.mesial);
    const [palatino, setPalatino] = useState(props.diente.palatino);
    const [selected, setSelected] = useState("");

    const clearSelected = () => {
        setVestibular(vestibular.replaceAll("selected", ""));
        setDistal(distal.replaceAll("selected", ""));
        setCentro(centro.replaceAll("selected", ""));
        setMesial(mesial.replaceAll("selected", ""));
        setPalatino(palatino.replaceAll("selected", ""));

    }

    const handleSelect = ( parte ) => {     
        
        clearSelected()

        switch (parte){
            case "vestibular":
                setVestibular(vestibular + ' selected' );
                setSelected('vestibular');
                break;
            case "distal" :
                setDistal(distal + ' selected' );
                setSelected('distal');
                break;
            case "centro": 
                setCentro(centro + ' selected' );
                setSelected('centro');
                break;
            case "mesial" :
                setMesial(mesial + ' selected' );
                setSelected('mesial');
                break;
            case "palatino" :
                setPalatino(palatino  + ' selected' );
                setSelected('palatino');
                break;
        }


    }
    
    const handleChange = (change) => {
        switch (selected){
            case "vestibular":
                setVestibular(change );
                break;
            case "distal" :
                setDistal(change);
                break;
            case "centro": 
                setCentro(change);
                break;
            case "mesial" :
                setMesial(change);
                break;
            case "palatino" :
                setPalatino(change);
                break;
        }
    }

    const handleConfirm = () => {
        clearSelected()
        props.submitDiente({
            vestibular: vestibular,
            distal: distal,
            centro: centro,
            mesial: mesial,
            palatino: palatino
        })
        props.onClose()
    }

    return(
        <Modal isOpen={props.showModal} onClose={props.onClose}>
            <div className="modalDiente">
                <h1>Diente {props.seccion} {props.num}</h1>

                <div className="cuerpo">
                    <div className="diente">
                        <div id="vestibular"  >
                            <div className={vestibular} onClick={() => handleSelect( "vestibular")}>

                            </div>
                        </div>
                        <div id="distal">
                            <div className={distal} onClick={() => handleSelect( "distal")}>
                                
                            </div>    
                            </div>
                        <div id="centro"> 
                            <div className={centro} onClick={() => handleSelect( "centro")}>
                                
                            </div>
                        </div>
                        <div id="mesial">
                            <div className={mesial} onClick={() => handleSelect( "mesial")}>
                                
                            </div>
                        </div>
                        <div id="palatino">
                            <div className={palatino} onClick={() => handleSelect( "palatino")} >
                                
                            </div>   
                        </div> 
                    
                    </div>

                    <div className="prestaciones">
                        <div className="btn-group" style={{display:'flex', width:'100%'}}>
                            <button className='carie' onClick={() => handleChange("carie")}>Carie</button>
                            <button className='restauracion' onClick={() => handleChange("restauracion")}>Restauracion</button>
                        </div>
                        <button className='button' onClick={()=> handleConfirm()}>Confirmar</button>
                    </div>    

                    
                </div>
                
            </div>
        </Modal>
    )
}

export default DienteModal