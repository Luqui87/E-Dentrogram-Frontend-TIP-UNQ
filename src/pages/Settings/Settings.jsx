import './Settings.css'

function Settings(){
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
                    <div className="settings-tags"></div>
                    <div className="settings-preturn"></div>
                </div>
            </div>
        </main>
    )
}

export default Settings