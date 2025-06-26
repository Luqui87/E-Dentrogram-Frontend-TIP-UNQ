import { useState } from 'react';
import Tag from '../../components/PatientsLogs/Tag'
import './Settings.css'

function Settings(){

    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState([])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          // Perform action when Enter is pressed
          console.log('Enter key pressed! Input value:', inputValue);
          // Example: Submit form, trigger a search, etc.
          setTags([...tags, inputValue]);
          setInputValue('')
        }
      };
      

    const mapTags = tags.map()

    return(
        <main>
            <div className="settings">
                <div className="left-bar">
                    <h2 style={{textAlign:"center"}}>Configuración</h2>
                    <div className="bar-items">
                        <span>Etiquetas</span>
                        <span>Mensaje pre-turno</span>
                    </div>
                </div>
                <div className="setting-content">
                    <div className="settings-tags">
                        <h2>Configurar Etiquetas</h2>
                        <label htmlFor="new-tag">
                            <input type="text" name="new-tag" id="new-tag"
                             placeholder='Ingresar etiqueta nueva'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown} />
                        </label>
                        
                        <span>Etiquetas actuales</span>
                        <div className="use-tags">
                            <div className="tags">
                                <Tag> Renovacion</Tag>
                                <Tag> tag 2</Tag>
                                <Tag> tag 3</Tag>
                                <Tag> tag 4</Tag>
                                <Tag> tag 5</Tag>
                                <Tag> tag 6</Tag>
                                <Tag> tag 3</Tag>
                                <Tag> tag 4</Tag>
                                <Tag> tag 5</Tag>
                                <Tag> tag 6</Tag>
                                <Tag> tag 3</Tag>
                                <Tag> tag 4</Tag>
                                <Tag> tag 5</Tag>
                                <Tag> tag 6</Tag>
                            </div>
                            
                        </div>
                    </div>
                    <div className="settings-preturn"></div>
                </div>
            </div>
        </main>
    )
}

export default Settings