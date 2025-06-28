import React, { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";

import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./Calendario.css";

import API, { handleApiError } from "../../service/API";
import Modal from "../Modal";
import QR from "../QR";

const CLIENT_ID =
  "1042049294933-6706691g5vb2fgonludemk973v9mlgeb.apps.googleusercontent.com";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

function CalendarApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");

  const [attachedFiles, setAttachedFiles] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const popoverRef = useRef(null);
  const [popoverContent, setPopoverContent] = useState("");
  const [popoverStyle, setPopoverStyle] = useState({ display: "none" });

  const [showQR, setShowQR] = useState(false);
  const [reschedule, setReschedule] = useState(null);



  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
        q: "E-Dentograma",
      })
      .then((response) => {
        const getEvents = response.result.items.map((d) => ({
          title: d.summary,
          start: d.start.dateTime,
          end: d.end.dateTime,
          description: d.description,
          googleId: d.id
        }));
        setEvents(getEvents);
      });
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          if (!authInstance.isSignedIn.get()) {
            authInstance.signIn();
          } else {
            listUpcomingEvents();
            setIsLoading(false);
          }
        });
    };

    gapi.load("client:auth2", initClient);

    API.getDentist(localStorage.getItem("username"))
      .then((res) => {
        setPatients(res.data.patients);
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      });
  }, []);

  /////////////////////////////////////////

  function sendMessage(patientTel) {
    const argentinaTime = new Date(start).toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
    });

    const argentinaDate = new Date(start).toLocaleDateString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const formData = new FormData();
    formData.append("number", patientTel);
    formData.append(
      "message",
      `Se agendó una reunión con el dentista a las ${argentinaTime} el día ${argentinaDate}.`
    );

    attachedFiles.forEach((file) => {
      formData.append("files", file);
    });

    console.log(`---- tel : ${patientTel} `);
    API.sendMsgWithFiles(formData)
      .then((res) => {
        toast.success("Mensaje enviado");
      })
      .catch((err) => toast.error("Error al enviar mensaje: " + err.message));
  }

  async function createCalendarEvent(actualEvents) {
    if (!selectedPatient) {
      toast.warning("Debes seleccionar un paciente.");
      return;
    }

    if (start >= end) {
      toast.warning("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }
    const patientTel = String(selectedPatient.telephone);

    const event = {
      summary: eventName,
      description: `Turno con ${selectedPatient.name}. Historia clinica ${selectedPatient.medicalRecord}. E-Dentograma`,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const tokenGoogle = gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().access_token;

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + tokenGoogle,
        },
        body: JSON.stringify(event),
      }
    )
      .then((res) => res.json()) 
      .then((response) => {
        toast.success("Evento agendado");
        sendMessage(patientTel);
        
        setEvents(actualEvents.concat([{
          title: eventName,
          start: start.toISOString(),
          end:end.toISOString(),
          description: `Turno con ${selectedPatient.name}. Historia clinica ${selectedPatient.medicalRecord}. E-Dentograma`,
          googleId: response.id
        }]));

        setIsModalOpen(false);
        setSelectedPatient(null);
        setReschedule(null);
        setEventName("");
        setStart(new Date());
        setEnd(new Date());
        setSelectedPatient(null);
      })
      .catch((error) => {
        console.error("Error al crear evento:", error); // cambiar por api handler error
        toast.error("Error al crear el evento");
      });
  }

  /////////////////////////////////////////

  const handleMouseEnter = (info) => {
    const { clientX, clientY } = info.jsEvent;

    let description = info.event.extendedProps.description;
    description = description.substring(0, description.length - 12);

    setPopoverContent(
      <div>
        <span style={{ fontSize: "2em" }}>{info.event.title}</span>
        <hr className="style-one" />

        <span>{description}</span>
      </div>
    );
    setPopoverStyle({
      display: "block",
      position: "absolute",
      top: `${clientY + 10}px`,
      left: `${clientX + 10}px`,
    });
  };

  const handleMouseLeave = () => {
    setPopoverStyle({ display: "none" });
  };
  /////////////////////////////////////////


  const handleEventClick = (info) => {
    const description =  info.event.extendedProps.description;
    const start = description.indexOf("Historia clinica");
    const end = description.indexOf(". E-Dentograma");

    const id = description.substring(start + 17, end);
    
    setReschedule(info.event);

    setSelectedPatient(patients.find((p) => p.medicalRecord === parseInt(id)));

    setIsModalOpen(true);
  }


  const handleRescheduleEvent = async () => {

    if (!selectedPatient) {
      toast.warning("Debes seleccionar un paciente.");
      return;
    }

    if (start >= end) {
      toast.warning("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    console.log(reschedule)

    const tokenGoogle = gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse().access_token;

    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${reschedule.extendedProps.googleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + tokenGoogle,
        },
      }
    )
    .then((response) => {
      if (response.status === 204) {
        const updateEvents = events.filter(e => e.googleId !== reschedule.extendedProps.googleId);
        createCalendarEvent(updateEvents);

      } 
    })
    .catch((error) => {
      console.log(error);
      toast.error("No se logro reagendar el evento");
    });

  }
  /////////////////////////////////////////


  return isLoading ? (
    <main style={{ alignItems: "center", justifyContent: "center" }}>
      <span className="loader"></span>
    </main>
  ) : (
    <main>
      <div className="calendario">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          height={"100%"}
          headerToolbar={{
            left: "prev,next today",
            center: "title addEventButton",
            right: "timeGridWeek,dayGridMonth seeQRButton",
          }}
          views={{
            dayGridMonth: { buttonText: "Mes" },
            timeGridWeek: { buttonText: "Semana" },
          }}
          events={events}
          scrollTime="07:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}

          eventClick={handleEventClick}

          customButtons={{
            addEventButton: {
              text: "Agendar Cita",
              click: () => setIsModalOpen(true),
            },
            seeQRButton: {
              text: "Whatsapp",
              click: () => {
                setShowQR(true);
              },
            },
          }}
        />
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => { 
        setIsModalOpen(false); 
        setSelectedPatient(null); 
        setReschedule(null); 
      }}>
        <div className="modal-content">
          <h2>{reschedule ? "Reagendar Cita" : "Agendar Cita"}</h2>

          <div className="field">
            <label className="bold-text">Seleccionar Paciente</label>
            <select
              value={selectedPatient?.medicalRecord || ""}
              onChange={(e) =>
                setSelectedPatient(
                  patients.find((p) => p.medicalRecord === parseInt(e.target.value))
                )
              }
              disabled={reschedule !== null}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map((patient) => (
                <option key={patient.medicalRecord} value={patient.medicalRecord}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Nombre del evento</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="dates-pickers">
            <div className="field">
              <p className="bold-text">Inicio de la cita</p>
              <DateTimePicker onChange={setStart} value={start} />
            </div>
            <div className="field">
              <p className="bold-text">Fin de la cita</p>
              <DateTimePicker onChange={setEnd} value={end} />
            </div>
          </div>

          <div className="field file-upload-field">
            <label className="bold-text">Adjuntar archivos</label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachedFiles(Array.from(e.target.files))}
            />
          </div>

          <div className="modal-buttons">
            <button
              className="cancelEventButton"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
            <button
              className="createEventButton"
              onClick={() => {
                if (reschedule) {
                  handleRescheduleEvent();
                } else {
                  createCalendarEvent(events);
                }
              }}
            >
              {reschedule ? "Reagendar evento" : "Crear evento"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showQR} onClose={() => setShowQR(false)}>
        <QR />
      </Modal>

      

      <div ref={popoverRef} className="custom-popover" style={popoverStyle}>
        {popoverContent}
      </div>
    </main>
  );
}

export default CalendarApp;
