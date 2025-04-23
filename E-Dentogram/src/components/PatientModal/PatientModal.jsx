import React, { useState } from "react";
import "./PatientModal.css";
import API from "../../service/API";
import { toast } from "react-toastify";

const PatientModal = ({ onClose, dentistId }) => {
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

  const handleSubmit = () => {
    if (!form.medicalRecord) {
      toast.error("Hay campos vacios");
      return;
    }
    try {
      const updatedForm = { ...form };

      if (!updatedForm.birthdate) {
        const today = new Date().toISOString().split("T")[0];
        updatedForm.birthdate = today;
      }
      API.addPatient(dentistId, updatedForm);
      toast.success("Paciente agregado exitosamente.");
      onClose();
    } catch (error) {
      toast.error("Hubo un error al agregar el paciente.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="tabs">
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
              <label>Historia Clínica</label>
              <input
                type="text"
                value={form.medicalRecord}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    medicalRecord: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="form">
              <label>Historia Clínica</label>
              <input
                type="text"
                value={form.medicalRecord}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    medicalRecord: e.target.value,
                  }))
                }
              />
              <label>DNI</label>
              <input
                type="text"
                value={form.dni}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    dni: e.target.value,
                  }))
                }
              />
              <label>Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <label>Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
              <label>Fecha de nacimiento</label>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    birthdate: e.target.value,
                  }))
                }
              />
              <label>Teléfono</label>
              <input
                type="text"
                value={form.telephone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    telephone: e.target.value,
                  }))
                }
              />
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={handleSubmit} className="confirm-button">
            Confirmar
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
