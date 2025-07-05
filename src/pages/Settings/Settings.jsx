import { useEffect, useState } from "react";
import Tag from "../../components/PatientsLogs/Tag";
import "./Settings.css";
import API, { handleApiError } from "../../service/API";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

function Settings() {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState("Tags");

  const [fileNames, setFileNames] = useState({});
  const [currentFiles, setCurrentFiles] = useState([]);

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({ accept: 'application/pdf' });

  useEffect(() => {
    getTagsFromStorage();
    getDocsFromStorage();
    const initialNames = {};
    acceptedFiles.forEach(file => {
    initialNames[file.path] = file.name;
  });
  setFileNames(initialNames);
  }, [acceptedFiles]);

  const DropIcon = () => <svg style={{width:"30%"}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 20L18.5 14M18.5 14L21 16.5M18.5 14L16 16.5" stroke="#d1d1d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12 7H19C20.1046 7 21 7.89543 21 9V11" stroke="#d1d1d1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

  const FileIcon = () => <svg style={{height:"100%"}} fill="#95b6bd" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5 0h-11c-1.104 0-2 0.895-2 2v28c0 1.105 0.896 2 2 2h19c1.105 0 2-0.895 2-2v-20zM25.5 10.829v0.171h-9v-9h0.172zM6.5 30v-28h8v11h11v17h-19z"></path> </g></svg>

   const DeleteIcon = ({ onClick })  =>
    <svg onClick={onClick} viewBox="0 0 24 24" className="file-delete-icon" fill="none">
      <path d="M10 12V17" stroke="#ff0909" strokeWidth="2" />
      <path d="M14 12V17" stroke="#ff0909" strokeWidth="2" />
      <path d="M4 7H20" stroke="#ff0909" strokeWidth="2" />
      <path
        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
        stroke="#ff0909"
        strokeWidth="2"
      />
      <path
        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
        stroke="#ff0909"
        strokeWidth="2"
      />
    </svg>
  

  const getTagsFromStorage = () => {
    const userTags = JSON.parse(localStorage.getItem("userTags"));
    if (userTags){
      setTags(userTags);
    }
    
  };

  const getDocsFromStorage = () => {
    const userDocs = JSON.parse(localStorage.getItem("userDocuments"));
    if (userDocs){
      setCurrentFiles(userDocs);
    }
    
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleNewTags = () => {
    API.patchDentistTags(tags)
      .then((res) => {
        localStorage.setItem("userTags", JSON.stringify(res.data.tags));
        toast.success("Etiquetas modificadas");
      })
      .catch((error) => {
        handleApiError(error);
      });
  };

  const handleDeleteCurrentFile = (file) => {
    API.deleteDocument(file)
    .then((res) => {
        toast.success("Documentos actualizados");
        localStorage.setItem("userDocuments", JSON.stringify(res.data.documents));
        setCurrentFiles(res.data.documents);
      })
    .catch((err) => {
      handleApiError(err);
    });
  }

  const handleTags = (tag) => {

      setTags( tags.filter( t => t !== tag ) );
      
    }

  const mapTags = tags.map((tag, index) => (
    <Tag
            key={index}
            setTag={() => handleTags(tag)}
            isSelected={tags.includes(tag)}
        >
            {tag}
    </Tag>
  ));
  
  const files = acceptedFiles.map(file => (
    <li key={file.path} className="file-item">
      <FileIcon />
      <input
        type="text"
        className="input"
        value={fileNames[file.path] || file.name}
        onChange={(e) => {
          setFileNames(prev => ({
            ...prev,
            [file.path]: e.target.value
          }));
        }}
      />
    </li>
  ));

  const renderCurrentFiles = currentFiles.map((file,index) => (
    <li key={index} className="file-item">
      <FileIcon />
      <span>{file}</span>
      <DeleteIcon onClick={() => handleDeleteCurrentFile(file)}/>
    </li>
      
  ))

  const handleDocuments = () => {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      const newName = fileNames[file.path] || file.name;

      const renamedFile = new File([file], newName, { type: file.type });

      formData.append("documents", renamedFile);
    });

    // Enviar a backend
    API.updateDocuments(formData)
      .then((res) => {
        toast.success("Documentos actualizados");
        localStorage.setItem("userDocuments", JSON.stringify(res.data.documents));
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  
  
  return (
    <main>
      <div className="settings">
        <div className="left-bar">
          <h2 style={{ textAlign: "center" }}>Configuración</h2>
          <div className="bar-items">
            <span
              className={selected == "Tags" ? "active" : ""}
              onClick={() => setSelected("Tags")}
            >
              Etiquetas
            </span>
            <span className={selected == "PreTurn"? "active" : ""} onClick={()=> setSelected("PreTurn")}>Mensaje pre-turno</span>
          </div>
        </div>
        <div className="setting-content">
          <div
            className="settings-tags"
            style={{ display: selected == "Tags" ? "" : "none" }}
          >
            <h2>Configurar Etiquetas</h2>
            <label htmlFor="new-tag">
              <input
                type="text"
                name="new-tag"
                id="new-tag"
                placeholder="Ingresar etiqueta nueva"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>

            <span>Etiquetas actuales</span>
            <div className="use-tags">
              <div className="tags">{mapTags}</div>
            </div>

            <div className="buttons">
              <button className="btn-confirmar" onClick={() => handleNewTags()}>
                Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => getTagsFromStorage()}
              >
                Cancelar
              </button>
            </div>
          </div>
          <div
            className="settings-preturn"
            style={{ display: selected == "PreTurn" ? "" : "none" }}
          >
            <h2>Añadir Documentos</h2>
              <div className="drop-files">
                <div {...getRootProps({className: 'dropzone'})}>
                  <DropIcon/>
                  <input {...getInputProps()} />
                  <span>Arrastar documentos</span>
                  <span>O</span>
                  <button style={{"font-size": "1.5em"}} className="btn-confirmar" >
                    Buscar archivo
                  </button>
              </div>
              </div>
              <div className="files">
                <span>Archivos Cargados</span>
                <ul>{acceptedFiles.length > 0  ? files : renderCurrentFiles}</ul>
                {acceptedFiles.length > 0 &&
                <button className="btn-confirmar" style={{marginTop:"auto"}} onClick={() => handleDocuments()}>
                  Confirmar
                </button>
                }
              </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default Settings;
