import './PacienteCard.css'

function PacienteCard({patient}){

    return(
        <div className="pacienteCard">
            <div>
                <span className='nombre'>{patient.name}</span>
                <div className='line'>
                    <span className="label"> N° Historia Clinica:</span>
                    <span className="field">{patient.medicalRecord}</span>
                </div>
                
            </div>
            <div>
                <div className='line'>
                    <span className="label"> D.N.I.:</span>
                    <span className="field"> {patient.dni}</span>
                </div>
                <div className='line'>
                    <span className="label">Dirección:</span>
                    <span className="field">{patient.address}</span>
                </div>
                <div className='line'>
                    <span className="label">Fecha de Nacimiento:</span>
                    <span className="field">{patient.birthdate}</span>
                </div>
            </div>
            <div>
                <div className='line'>
                    <span className="label"> Telefono:</span>
                    <span className="field"> {patient.telephone}</span>
                </div>
                <div className='line'>
                    <span className="label">Correo:</span>
                    <span className="field">{patient.email}</span>
                </div>
            </div>
        </div>
    )
}

export default PacienteCard