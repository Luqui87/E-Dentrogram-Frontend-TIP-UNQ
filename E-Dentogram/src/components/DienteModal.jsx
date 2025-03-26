import './DienteModal.css'
import Modal from './Modal'

function DienteModal(props){

    

    return(
        <Modal isOpen={props.showModal} onClose={props.onClose}>
            <div className="modalDiente">
                <h1>Diente {props.seccion} {props.num}</h1>

                <div className="cuerpo">
                    <div className="diente">
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

                    <div className="prestaciones">
                        <div class="btn-group" style={{width:'100%'}}>
                            <button className='carie'>Carie</button>
                            <button className='restauraciones'>Restauraciones</button>
                        </div>
                    </div>    
                </div>
                
            </div>
        </Modal>
    )
}

export default DienteModal