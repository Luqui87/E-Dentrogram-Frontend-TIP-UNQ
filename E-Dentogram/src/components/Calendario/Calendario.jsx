import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import "./Calendario.css";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";

import API from "../../service/API";
import handleApiError from "../../service/API";

const CLIENT_ID =
  "1042049294933-6706691g5vb2fgonludemk973v9mlgeb.apps.googleusercontent.com";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function CalendarApp() {
  const [events, setEvents] = useState([]);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);

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
        }));
        setEvents(getEvents);
      });
  };

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
      description: "E-Dentograma",
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

  return (
    <main>
      <div className="calendario">
        <button className="agendar-btn" onClick={() => setIsModalOpen(true)}>
          Agendar Evento
        </button>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          height={"100%"}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          views={{
            dayGridMonth: { buttonText: "Mes" },
            timeGridWeek: { buttonText: "Semana" },
          }}
          events={events}
        />
      </div>

      {isModalOpen && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="modal-content">
            <h2>Agendar Cita</h2>
            <div className="field">
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
              <label>Nombre del evento</label>
              <input
                type="text"
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <p className="bold-text">Inicio de la cita</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p className="bold-text">Fin de la cita</p>
            <DateTimePicker onChange={setEnd} value={end} />
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
        </>
      )}
    </main>
  );
}

export default CalendarApp;
