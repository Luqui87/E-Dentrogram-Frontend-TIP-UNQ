import './PacienteCard.css'

function PacienteCard(){
    return(
        <div className="pacienteCard">
            <div>
                <span className='nombre'>Lucas Alvarez</span>
                <div className='line'>
                    <span className="label"> N° Historia Clinica:</span>
                    <span className="field"> 341234</span>
                </div>
                
            </div>
            <div>
                <div className='line'>
                    <span className="label"> D.N.I.:</span>
                    <span className="field"> 42.594.982</span>
                </div>
                <div className='line'>
                    <span className="label">Dirección:</span>
                    <span className="field">Bragado 1947</span>
                </div>
                <div className='line'>
                    <span className="label">Fecha de Nacimiento:</span>
                    <span className="field"> 12/10/2000</span>
                </div>
            </div>
            <div>
                <div className='line'>
                    <span className="label"> Telefono:</span>
                    <span className="field"> 1153215031</span>
                </div>
                <div className='line'>
                    <span className="label">Correo:</span>
                    <span className="field">alvarezlucas@gmail.com</span>
                </div>
            </div>
        </div>
    )
}

export default PacienteCard