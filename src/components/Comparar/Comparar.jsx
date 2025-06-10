import { useState, useEffect } from "react";
import "./Comparar.css";
import DateTimePicker from "react-datetime-picker";
import API from "../../service/API";
import Odontograma from "../Odontograma/Odontograma";

function Comparar({ active, type, id, comparacion }) {
  const [firstDate, setFirstDate] = useState(null);
  const [secondDate, setSecondDate] = useState(null);
  const [firstOdontogram, setFirstOdontogram] = useState(null);
  const [secondOdontogram, setSecondOdontogram] = useState(null);
  const [firstLoading, setFirstLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);

  useEffect(() => {
    if (comparacion?.length === 2) {
      const first = new Date(comparacion[0].date);
      const second = new Date(comparacion[1].date);

      handleChange(first, setFirstDate, setFirstOdontogram, setFirstLoading);
      handleChange(
        second,
        setSecondDate,
        setSecondOdontogram,
        setSecondLoading
      );
    }
  }, [comparacion]);

  const handleChange = (date, setDate, setOdontogram, setLoading) => {
    if (!date) return;

    setDate(date);
    setLoading(true);

    const formattedDate = date.toISOString().split("T")[0];

    API.getTeethAtDate(id, formattedDate)
      .then((res) => {
        console.error("res:", res);
        setOdontogram(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener odontograma:", err);
        setOdontogram(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={`${active} Comparar`}>
      <div className="before">
        <h2>Odontograma a la fecha</h2>
        {!firstDate && (
          <DateTimePicker
            value={firstDate}
            onChange={(d) =>
              handleChange(d, setFirstDate, setFirstOdontogram, setFirstLoading)
            }
          />
        )}
        {firstDate && (
          <>
            <p>
              <strong>{firstDate.toLocaleString()}</strong>
            </p>
            {firstLoading ? (
              <span className="loader"></span>
            ) : (
              firstOdontogram && (
                <Odontograma
                  type={`${type} Comparar`}
                  active="active"
                  teeth={firstOdontogram}
                />
              )
            )}
          </>
        )}
      </div>

      <hr />

      <div className="after">
        <h2>Odontograma a la fecha</h2>
        {!secondDate && (
          <DateTimePicker
            value={secondDate}
            onChange={(d) =>
              handleChange(
                d,
                setSecondDate,
                setSecondOdontogram,
                setSecondLoading
              )
            }
          />
        )}
        {secondDate && (
          <>
            <p>
              <strong>{secondDate.toLocaleString()}</strong>
            </p>
            {secondLoading ? (
              <span className="loader"></span>
            ) : (
              secondOdontogram && (
                <Odontograma
                  type={`${type} Comparar`}
                  active="active"
                  teeth={secondOdontogram}
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comparar;
