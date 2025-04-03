import './DienteModal.css'
import Modal from '../Modal'
import {useParams} from 'react-router-dom';
import { useEffect, useState} from 'react'

function DienteModal(props){

    const [vestibular, setVestibular] = useState("");
    const [distal, setDistal] = useState("");
    const [centro, setCentro] = useState("");
    const [mesial, setMesial] = useState("");
    const [palatino, setPalatino] = useState("");
    const [selected, setSelected] = useState("");
    const [showConfirm, setShowConfirm] = useState(false)

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

        if ([vestibular, mesial, palatino, distal, centro].some(e=> !e.includes("HEALTHY"))){

            const putTooth = [{
                number: number,
                up: vestibular.replaceAll(" selected", ""),
                right: mesial.replaceAll(" selected", ""),
                down: palatino.replaceAll(" selected", ""),
                left: distal.replaceAll(" selected", ""),
                center: centro.replaceAll(" selected", "")
            }]
            

            console.log(putTooth)
    
            const putData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/update/tooth/${id}`,{
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        mode: "cors",
                        body: JSON.stringify(putTooth)
                    });
                    
                    props.submitDiente({
                        up: vestibular,
                        left: distal,
                        center: centro,
                        right: mesial,
                        down: palatino
                    });
    
                    setShowConfirm(true);
                    
                } catch (error){
                    console.log(error);
                }

            };
              
            putData()
        } else{
            console.log("No realizo cambios")
        }
        
    }

    return(
        <Modal isOpen={props.showModal} onClose={props.onClose}>
            <div className="modalDiente">
                <h1>Diente {props.seccion} {props.num}</h1>
                { showConfirm ? <h2>Cambios confirmados</h2> : null}
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
                            <button className='CARIES' onClick={() => handleChange("CARIES")}>Carie</button>
                            <button className='RESTORATION' onClick={() => handleChange("RESTORATION")}>Restauracion</button>
                        </div>
                        <button className='button' onClick={()=> handleConfirm()}>Confirmar</button>
                    </div>    

                    
                </div>
                
            </div>
        </Modal>
    )
}

export default DienteModal