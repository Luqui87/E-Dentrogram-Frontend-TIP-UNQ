import { useEffect, useState } from "react";
import Tag from "../../components/PatientsLogs/Tag";
import "./Settings.css";
import API, { handleApiError } from "../../service/API";
import { toast } from "react-toastify";

function Settings() {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState("Tags");

  useEffect(() => {
    getTagsFromStorage();
  }, []);

  const getTagsFromStorage = () => {
    const userTags = JSON.parse(localStorage.getItem("userTags"));
    setTags(userTags);
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
            {
              //<span className={selected == "PreTurn"? "active" : ""} onClick={()=>setSelected("PreTurn")}>Mensaje pre-turno</span>
            }
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
            style={{ display: selected == "PreTrun" ? "" : "none" }}
          ></div>
        </div>
      </div>
    </main>
  );
}

export default Settings;
