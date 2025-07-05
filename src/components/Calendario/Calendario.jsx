import React, { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import interactionPlugin from '@fullcalendar/interaction';

import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "./Calendario.css";


import API, { handleApiError } from "../../service/API";
import Modal from "../Modal";
import QR from "../QR/QR";

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
  const [duration, setDuration] = useState(null)
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

  const [userDocuments, setUserDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([])

    const FileIcon = () => <svg style={{height:"100%"}} fill="#95b6bd" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.5 0h-11c-1.104 0-2 0.895-2 2v28c0 1.105 0.896 2 2 2h19c1.105 0 2-0.895 2-2v-20zM25.5 10.829v0.171h-9v-9h0.172zM6.5 30v-28h8v11h11v17h-19z"></path> </g></svg>

  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
          googleId: d.id,
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

          if (!authInstance) {
            toast.error("No se pudo inicializar la autenticación de Google.");
            setIsLoading(false);
            return;
          }

          if (!authInstance.isSignedIn.get()) {
            return authInstance.signIn().then(() => {
              listUpcomingEvents();
              setIsLoading(false);
            });
          } else {
            listUpcomingEvents();
            setIsLoading(false);
          }
        })
        .catch((err) => {
          toast.error("Error al inicializar Google Calendar");
          console.error("GAPI init error", err);
          setIsLoading(false);
        });
    };

    // Cargar client + auth2
    gapi.load("client:auth2", () => {
      try {
        if (gapi.auth2) {
          initClient();
        } else {
          toast.error("Google API no disponible");
          setIsLoading(false);
        }
      } catch (e) {
        console.error("gapi.load error", e);
        setIsLoading(false);
      }
    });

    // Cargar documentos de usuario desde localStorage
    const docs = JSON.parse(localStorage.getItem("userDocuments"));
    if (docs) {
      setUserDocuments(docs);
    }

    // Obtener pacientes del dentista logueado
    API.getDentist(localStorage.getItem("username"))
      .then((res) => {
        setPatients(res.data.patients);
      })
      .catch((error) => {
        toast.error(handleApiError(error));
      });

  }, []);

  const handleDocumentChange = (document) => {
    if (selectedDocuments.includes(document)){
      setSelectedDocuments(prevDocuments => prevDocuments.filter(sd => sd !== document))
    }
    else{
      setSelectedDocuments([...selectedDocuments, document])
    }
  }

  const renderDocuments = 
    userDocuments.map((document,index) =>(
      <li>
        <FileIcon/>
        <label htmlFor={document} style={{"font-size": "1.1em", marginRight:"auto"}}>{document}</label>
        <input type="checkbox" 
        checked={selectedDocuments.includes(document)}
        onChange={() => {handleDocumentChange(document)}} 
        id={index} name={document} />
      </li>
    ));
  

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

    const params = new URLSearchParams();
    selectedDocuments.forEach(doc => params.append("doc", doc));

    API.sendMsgWithFiles(formData, params)
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

    await API.addTurn({
      date: start.toISOString(),
      patientId: selectedPatient.medicalRecord,
    })
      .then(() => {
        toast.success("Turno registrado");
      })
      .catch((error) => {
        toast.error("Error al guardar el turno: " + handleApiError(error));
        return;
      });

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

      gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      })
      .then((response) => {
        toast.success("Evento agendado");
        sendMessage(patientTel);

        setEvents(
          actualEvents.concat([
            {
              title: eventName,
              start: start.toISOString(),
              end: end.toISOString(),
              description: `Turno con ${selectedPatient.name}. Historia clinica ${selectedPatient.medicalRecord}. E-Dentograma`,
              googleId: response.id,
            },
          ])
        );

        setIsModalOpen(false);
        setSelectedPatient(null);
        setReschedule(null);
        setEventName("");
        setStart(new Date());
        setEnd(new Date());
        setSelectedPatient(null);
      })
      .catch((error) => {
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
    const description = info.event.extendedProps.description;
    const start = description.indexOf("Historia clinica");
    const end = description.indexOf(". E-Dentograma");

    const id = description.substring(start + 17, end);

    setReschedule(info.event);

    setSelectedPatient(patients.find((p) => p.medicalRecord === parseInt(id)));

    setIsModalOpen(true);
  };

  const handleRescheduleEvent = async () => {
    if (!selectedPatient) {
      toast.warning("Debes seleccionar un paciente.");
      return;
    }

    if (start >= end) {
      toast.warning("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    gapi.client.calendar.events.delete({
    calendarId: "primary",
    eventId: reschedule.extendedProps.googleId,
     })
    .then((response) => {
      if (response.status === 204) {
        const updateEvents = events.filter(e => e.googleId !== reschedule.extendedProps.googleId);
        createCalendarEvent(updateEvents);

      } 
    })
    .catch((error) => {
      toast.error("No se logro reagendar el evento");
    });

    await API.rescheduleTurn(formatDate(start), {
      date: reschedule.start,
      patientId: selectedPatient.medicalRecord,
    })
      .then(() => {
        
        toast.success("Turno reprogramado");
      })
      .catch((error) => {
        toast.error("No se pudo reagendar el turno: " + handleApiError(error));
        return;
      });
  };
  /////////////////////////////////////////

  const handleEventChange = (info) => {
    const event = info.event;

    const updatedEvent = {
      summary: event.title,
      description: event.extendedProps.description,
      start: {
        dateTime: event.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: event.end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    gapi.client.calendar.events.update({
      calendarId: "primary",
      eventId: event.extendedProps.googleId,
      resource: updatedEvent,
    })
    .then((res) => {
      toast.success("Evento reagendado exitosamente");
    })
    .catch((error) => {
      toast.error(error);
    })
    
  }

///////////////////////////////////////////////////////

const handleDuration = (dur) => {
  if (dur !== duration){
    setDuration(dur);
    const newDate = new Date(start);
    newDate.setMinutes(newDate.getMinutes() + dur);
    setEnd(newDate);
  }
    
}


  return isLoading ? (
    <main style={{ alignItems: "center", justifyContent: "center" }}>
      <span className="loader"></span>
    </main>
  ) : (
    <main className="calendar-main">
      <div className="calendario">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
          
          eventDrop={handleEventChange}
          eventResize={handleEventChange}

          editable={true}

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
        setStart(new Date());
        setEnd(null);
        setDuration(null);
      }}>
        <div className="modal-content">
          <h2>{reschedule ? "Reagendar Cita" : "Agendar Cita"}</h2>

          <div className="field">
            <label className="bold-text">Seleccionar Paciente</label>
            <select
              value={selectedPatient?.medicalRecord || ""}
              onChange={(e) =>
                setSelectedPatient(
                  patients.find(
                    (p) => p.medicalRecord === parseInt(e.target.value)
                  )
                )
              }
              disabled={reschedule !== null}
            >
              <option value="">Seleccionar paciente</option>
              {patients.map((patient) => (
                <option
                  key={patient.medicalRecord}
                  value={patient.medicalRecord}
                >
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

            <div className="field">
              <p className="bold-text">Fecha y inicio</p>
              <DateTimePicker locale="es-ES"  format="dd/MM/y HH:mm" onChange={(date) => {setStart(date); setEnd(date)}} value={start} />
            </div>
            <div className="field" style={{gap:"10px"}}>
              <label className="bold-text">Duración</label>
              
              <div className="duration-checks">
                <div>
                  <input type="checkbox" id="duration" name="30 Minutos"
                  onChange={() => { handleDuration(30)}}
                  checked={duration == 30}/>
                  <label for="30 Minutos">30 Minutos</label>
                </div>

                <div>
                  <input type="checkbox" id="duration" name="1 Hora"
                  onChange={() => { handleDuration(60)}}
                  checked={duration == 60}
                  />
                  <label for="1 Hora"> 1 Hora</label>
                </div>

                <div>
                  <input type="checkbox" id="duration" name="2 Horas"
                  onChange={() => {handleDuration(180)}}
                  checked={duration == 180}/>
                  <label for="2 Horas"> 2 Hora</label>
                </div>

                <div>
                  <input type="checkbox" id="duration" name="Manual"
                  onChange={() => setDuration(0)}
                  checked={duration == 0}/>
                  <label for="Manual">Manualmente</label>
                </div>
              </div>
              
              {duration == 0 && <DateTimePicker locale="es-ES"  format="dd/MM/y HH:mm" onChange={setEnd} value={end} />}
            </div>
          
          { userDocuments.length > 0 && <div className="field select-documents">
              <label>Seleccionar documentos</label>
              <ul>{renderDocuments}</ul>
          </div>
          } 
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
