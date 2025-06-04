import React, { useEffect, useState } from "react";
import API from "../../service/API";
import ReactQRCode from "react-qr-code";

function QR() {
  const [qrData, setQrData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let interval;

    const fetchQr = () => {
      API.getWhatsappQr()
        .then((res) => {
          setQrData(res.data.qr);
          setIsBusy(false);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error al actualizar el QR", err);
          setIsLoading(false);
          if (err.response && err.response.status === 404) {
            setIsBusy(true);
            setQrData("");
          } else {
            setIsBusy(false);
            setQrData("");
          }
        });
    };

    fetchQr();
    interval = setInterval(fetchQr, 35000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return <p>Cargando código QR...</p>;
  }

  if (isBusy) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p className="bold-text" style={{ color: "red" }}>
          El sistema esta vinculardo. Intenta más tarde.
        </p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p className="bold-text">
        Escanea este QR con WhatsApp para poder vincularte:
      </p>
      {qrData ? (
        <ReactQRCode value={qrData} size={256} />
      ) : (
        <p>No se pudo cargar el código QR</p>
      )}
    </div>
  );
}

export default QR;
