import { gapi } from "gapi-script";
import { useEffect } from "react";
import API from "../../service/API";

const CLIENT_ID = "1042049294933-6706691g5vb2fgonludemk973v9mlgeb.apps.googleusercontent.com";
const API_KEY = "AIzaSyBADYobhmEaUSbIlFJoFeKdrNC_EonX52o";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";


function Calendario(){
      useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      });
    }

    gapi.load("client:auth2", start);
  }, []);

const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn().then((res) => {
        console.log("Respuesta de autenticación:", res);
        
        const idToken = res.xc.id_token
        console.log("Token:",idToken )

        API.loginGoogle(idToken)

            .then((res) => {

              console.log("Token de sesión del backend:",res.data.accessToken	);
              localStorage.setItem("token", res.data.accessToken);

              // Redirige o actualiza el estado de autenticación
            })
            .catch((error) => {
                console.error("Error al autenticar con el backend:", error);
            });
    });
};

  const listEvents = () => {
    gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    }).then(response => {
      console.log("Eventos:", response.result.items);
    });
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Iniciar sesión con Google</button>
      <button onClick={listEvents}>Ver próximos eventos</button>
    </div>
  );
}

export default Calendario