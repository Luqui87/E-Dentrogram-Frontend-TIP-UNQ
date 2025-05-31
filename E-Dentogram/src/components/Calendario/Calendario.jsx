import React, { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import "./Calendario.css";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


import API from "../../service/API";
import handleApiError from "../../service/API";
import Modal from "../Modal";

const CLIENT_ID =
  "1042049294933-6706691g5vb2fgonludemk973v9mlgeb.apps.googleusercontent.com";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function CalendarApp() {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState([]);

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const popoverRef = useRef(null);
  const [popoverContent, setPopoverContent] = useState('');
  const [popoverStyle, setPopoverStyle] = useState({ display: 'none' });

  
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
          description: d.description
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
            setIsLoading(false)
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

    console.log(`---- tel : ${patientTel} `);
    API.sendWhatsapp({
      number: patientTel,
      message: `Se agendó una reunión con el dentista a las ${argentinaTime} el día ${argentinaDate}.`,
    });
  }

  async function createCalendarEvent() {
    if (!selectedPatient) {
      toast.error("Debes seleccionar un paciente.");
      return;
    }

    if (start >= end) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin.");
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
      .then((data) => data.json())
      .then(() => {
        toast.success("Evento agendado");
        sendMessage(patientTel);
        

        setEvents(events.concat([{
          title: eventName,
          start: start.toISOString(),
          end:end.toISOString()}]));

        setIsModalOpen(false);
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

    let description = info.event.extendedProps.description
    description = description.substring(0, description.length - 12)

    setPopoverContent(
      <div>
        <span style={{fontSize:"2em"}}>{info.event.title}</span>
        <hr className="style-one"/>

        <span>{description}</span>
      </div>

    );
    setPopoverStyle({
      display: 'block',
      position: 'absolute',
      top: `${clientY + 10}px`,
      left: `${clientX + 10}px`
    });
  };

  const handleMouseLeave = () => {
    setPopoverStyle({ display: 'none' });
  };
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
            right: "dayGridMonth,timeGridWeek",
          }}
          views={{
            dayGridMonth: { buttonText: "Mes" },
            timeGridWeek: { buttonText: "Semana" },
          }}
          events={events}
          scrollTime= "07:00:00"
          allDaySlot={false}
          nowIndicator={true}

          eventMouseEnter={handleMouseEnter}
          eventMouseLeave={handleMouseLeave}

          customButtons={{
            addEventButton: {
              text: "Agendar Cita",
              click: () => setIsModalOpen(true)
              }
          }}

        />
      </div>
      
      <Modal isOpen={isModalOpen} onClose={()=> setIsModalOpen(false)}>
          <div className="modal-content">
            <h2>Agendar Cita</h2>
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
            
            <div className="modal-buttons">
              <button
                className="cancelEventButton"
                onClick={() => setIsModalOpen(false)}
              >
                Cerrar
              </button>
              <button
                className="createEventButton"
                onClick={createCalendarEvent}
              >
                Crear evento
              </button>
            </div>
          </div>
        
      </Modal>

      <div ref={popoverRef} className="custom-popover" style={popoverStyle}>
        {popoverContent}
      </div>

    </main>
  );
}

export default CalendarApp;
