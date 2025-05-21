import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import "./Calendario.css";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-toastify";

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

  async function createCalendarEvent() {
    console.log(` creando evento de calendario `);
    const event = {
      summary: eventName,
      description: "",
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
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(`------- data  : ${data}`);
        toast.success("Evento agendado");
      })
      .catch((error) => {
        console.error("Error al crear evento:", error); // temporal
        toast.error("Error al crear el evento");
      });
  }

  console.log(`start : ${start}`);
  console.log(`end : ${end}`);
  console.log(`eventName : ${eventName}`);
  console.log(`--------------TOKEN--------------------`);
  if (gapi.auth2 && gapi.auth2.getAuthInstance) {
    console.log(
      gapi.auth2.getAuthInstance().currentUser.get().getGrantedScopes()
    );
  }
  console.log(`--------------------------------------`);

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
            <div className="field">
              <label>Nombre del evento</label>
              <input
                type="text"
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <h2>Agendar Cita</h2>
            <p>Inicio de la cita</p>
            <DateTimePicker onChange={setStart} value={start} />
            <p>Fin de la cita</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <button onClick={() => createCalendarEvent()}>Crear evento</button>
            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        </>
      )}
    </main>
  );
}

export default CalendarApp;
