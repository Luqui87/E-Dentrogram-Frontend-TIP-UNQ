import { useEffect, useState } from "react"
import Modal from "../Modal"
import API, { handleApiError } from "../../service/API";
import Tag from "./Tag";

function toLocalDateTimeString(fecha) {
      const pad = n => String(n).padStart(2, '0');
      const padMs = n => String(n).padStart(3, '0');

      const anio = fecha.getFullYear();
      const mes = pad(fecha.getMonth() + 1);
      const dia = pad(fecha.getDate());

      const horas = pad(fecha.getHours());
      const minutos = pad(fecha.getMinutes());
      const segundos = pad(fecha.getSeconds());
      const milisegundos = padMs(fecha.getMilliseconds() + 1);

      return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}.${milisegundos}`;
}


function AddPatientLogModal({isOpen, onClose, handleAddLog, id}){

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const [description, setDescription] = useState("")

    useEffect(() => {
        setDescription("");
        setSelectedTags([]); 

        const userTags = JSON.parse(localStorage.getItem('userTags'));
        setTags(userTags)
        
    }, [isOpen]);


    const handleTags = (tag) => {

        if (selectedTags.includes(tag)) {
            setSelectedTags( selectedTags.filter( t => t !== tag ) );

        }
        else{
            const update = [...selectedTags, tag]
            console.log(update);
            setSelectedTags(update)
        }
    }

    const Tags = tags.map((tag, index) => (
        <Tag
            key={index}
            setTag={() => handleTags(tag)}
            isSelected={selectedTags.includes(tag)}
        >
            {tag}
        </Tag>
));

    const handleConfirm = () => {

        const jorunalEntry = {
            log: description,
            tags: selectedTags,
            date: toLocalDateTimeString(new Date())
        }

        API.postPatientJournal(id, jorunalEntry)
            .then((response) => {
                handleAddLog(jorunalEntry);
                onClose();
            })
            .catch((error) => {
                handleApiError(error);
            })
        
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <span style={{textAlign:"center", fontSize:"1.5em", }}><b>Ingresar Registro a la Bitacora</b></span>
            <hr />

            <span style={{fontSize:"1.2em"}}>Descripción</span>
            <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="textarea" rows="5" cols="20"></textarea>

            <span style={{fontSize:"1.2em"}}>Tratamientos comunes</span>

            <div className="selected-tags">
                {Tags}
            </div>

            <div className="buttons">
                <button className="btn-confirmar" onClick={() => {handleConfirm()}}>
                  Confirmar
                </button>
                <button className="btn-cancelar" onClick={onClose}>
                  Cancelar
                </button>
            </div>
        </Modal>
    )
}

export default AddPatientLogModal
