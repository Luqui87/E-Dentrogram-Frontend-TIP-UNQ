import { useEffect, useState } from "react"
import Modal from "../Modal"
import API, { handleApiError } from "../../service/API";

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

function Tag({setTag, children}){

    const AddIcon = () => {
        return (
            <svg onClick={() => addTag()} className="tag-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        );
    };

    const CloseIcon = () => {
        return(
            <svg onClick={() => deleteTag()} className="tag-icon" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="#ffffff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="#ffffff"></path> </g></svg>
        )
    }

    const SelectedIcon = () => {
        return(
            <svg className="tag-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        )
    }

    

    const [icon,setIcon] = useState(AddIcon);
    const [isSelected, setIsSelected] = useState(false);
    

    const addTag = () => {
        setIcon(SelectedIcon);
        setIsSelected(true);
        setTag();
    }

    const deleteTag = () => {
        setIcon(AddIcon);
        setIsSelected(false);
        setTag();
    }

    const handleMouseEnter = () => {
        if (isSelected == true){
            setIcon(CloseIcon)
        }
        
    }
    
    const handleMouseLeave = () => {
        if (isSelected == true){
            setIcon(SelectedIcon)
        }
    }

    return(
        <span className="tag" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()} >{children} {icon}</span>
    )
}


function AddPatientLogModal({isOpen, onClose, handleAddLog, id}){

    const [tags, setTags] = useState([
    { tag: "GENERAL_REVIEW", caption: "Vista general" },
    { tag: "SURGERY", caption: "Cirugía" },
    { tag: "CLEANING", caption: "Limpieza" },
    { tag: "WHITENING", caption: "Blanqueamiento" },
    { tag: "ORTHODONTICS", caption: "Ortodoncia" },
    { tag: "FLUORIDE", caption: "Flúor" },
    { tag: "PEDIATRIC", caption: "Pediatría" },
    { tag: "CHECKUP", caption: "Chequeo" }
]);
    const [selectedTags, setSelectedTags] = useState([]);

    const [description, setDescription] = useState("")

    useEffect(() => {
        setDescription("");
        setSelectedTags([]);
    }, [isOpen]);


    const handleTags = (tag) => {
        const index = selectedTags.indexOf(tag);

        console.log(index);

        if (index === -1 ) {
            setSelectedTags([...selectedTags, tag])
        }
        else{
            setSelectedTags( selectedTags.filter( t => t !== tag ) );
        }
    }

    const Tags = tags.map((tag, index) => <Tag key={index} setTag={() => handleTags(tag)}>{tag.caption}</Tag> );

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
