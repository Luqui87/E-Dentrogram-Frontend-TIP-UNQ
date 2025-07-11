import React, { useState } from "react";
import "./PatientModal.css";
import API from "../../service/API";
import {handleApiError} from "../../service/API.jsx";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Modal from "../Modal";

const PatientModal = ({ showModal, onClose, dentistId, patient, handleEditedPatient }) => {
  const [activeTab, setActiveTab] = useState("agregar");
  const [form, setForm] = useState({
    medicalRecord: "",
    dni: "",
    name: "",
    address: "",
    birthdate: "",
    telephone: "",
    email: "",
  });

  useEffect(() => {
    if (patient){
      setActiveTab("registrar");
      let phone = patient.telephone.toString();
      phone = phone.slice(2);
      setForm({ ...patient, telephone: parseInt(phone)  } );
    }
    else{
      setForm({
      medicalRecord: "",
      dni: "",
      name: "",
      address: "",
      birthdate: "",
      telephone: "",
      email: "",
    })
    }
  }, [showModal, patient])

  const handleSubmit = () => {
    if (!form.medicalRecord) {
      toast.error("Hay campos vacios");
      return;
    }
    const updatedForm = { ...form, telephone : 54 + form.telephone};

    if (!updatedForm.birthdate) {
      const today = new Date().toISOString().split("T")[0];
      updatedForm.birthdate = today;
      
    }
    API.addPatient(dentistId, updatedForm)
    .then((res) => {
      console.log("Hola")
      toast.success("Paciente agregado exitosamente.");
      onClose();
      handleEditedPatient(res.data); 
      
    })
    .catch((error) => {
      toast.error(handleApiError(error))
    });
  };

  const handleEditPatient = () => {
    API.updatePatient({...form, telephone: 54 + form.telephone})
    .then((res) => {
      toast.success("Paciente editado exitosamente");
      handleEditedPatient(res.data)
      onClose();
      
    })
    .catch((error) => {
      toast.error(handleApiError(error));
    })
  }

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <div className="tabs" style={{display: patient? "none" : ""}} >
        <button
          className={activeTab === "agregar" ? "active" : ""}
          onClick={() => setActiveTab("agregar")}
        >
          Agregar
        </button>
        <button
          className={activeTab === "registrar" ? "active" : ""}
          onClick={() => setActiveTab("registrar")}
        >
          Registrar
        </button>
      </div>

      <div className="modal-body">
        {activeTab === "agregar" ? (
          <div className="form">
            <div
              className="field"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label htmlFor="id">Historia Clínica</label>
                <input
                  type="text"
                  id="id"
                  value={form.medicalRecord}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      medicalRecord: e.target.value,
                    }))
                  }
                />
              
            </div>
          </div>
        ) : (
          <div className="form">
            <span style={{width:'100%', flex:"1 auto", fontSize:"2em"}}>{patient? "Modificar información de paciente" : "Ingresar datos de paciente"}</span>
            <hr style={{width:'100%', flex:"1 auto"}}/>
              <div className="form-fields">
                <div className="field">
                <label htmlFor="id">Historia Clínica</label>
                <input
                  type="text"
                  id="id"
                  value={form.medicalRecord}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      medicalRecord: e.target.value,
                    }))
                  }
                  disabled={patient}
                />
                
              </div>
              
              <div className="field">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                value={form.dni}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    dni: e.target.value,
                  }))
                  }
                />
                
              </div>

              <div className="field">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                
              </div>

              <div className="field">
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
                
              </div>

              <div className="field">
                <label htmlFor="">Fecha de nacimiento</label>
                <input
                  id="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      birthdate: e.target.value,
                    }))
                  }
                />
                
              </div>

              <div className="field" style={{gap:""}}>
                <label htmlFor="phone">Teléfono</label>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}  >
                  <span>+54</span>
                  <input
                    id="phone"
                    type="text"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        telephone: e.target.value,
                      }))
                    }
                    style={{width:"180px"}}
                  />
              </div>
              

              </div>

              <div className="field" style={{alignItems:"center"}}>
                <label htmlFor="email" style={{marginRight:"23vw"}}>Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  style={{width: "25vw"}}
                />
                
              </div>              
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button onClick={patient? handleEditPatient: handleSubmit} className="confirm-button">
          Confirmar
        </button>
        <button onClick={onClose } className="cancel-button">
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

export default PatientModal;
