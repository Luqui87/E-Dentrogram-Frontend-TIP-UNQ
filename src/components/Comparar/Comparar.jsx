import Modal from '../Modal'
import Odontograma from '../Odontograma/Odontograma'

function Comparar(){

    return(
        <Modal isOpen={true} >
            <h2 style={{margin:"auto"}}>Version en la fecha 20/05</h2>
            <Odontograma type={"Adulto"} active={'active'} teeth={[]} />
            <hr style={{height: "5px", backgroundColor: "black"}} />

            <h2>Version en la fecha 05/06 </h2>
            <Odontograma type={"Adulto"} active={'active'} teeth={[]} />
        </Modal>
    )
}

export default Comparar
