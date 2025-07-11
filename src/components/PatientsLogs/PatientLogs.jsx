import "./PatientLogs.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import AddPatientLogModal from "./AddPatientLogModal";
import { useEffect, useState } from "react";
import API, { handleApiError } from "../../service/API";

function PatientLogs({ active, id }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientLogs, setPatientLogs] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    API.getPatientJournal(id, page)
      .then((res) => {
        setPatientLogs(res.data.journal);
      })
      .catch((error) => {
        handleApiError(error);
      });
  }, []);

  const contentStyle = {
    marginLeft: "140px",
    width: "84%",
  };

  const AddIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const logs = patientLogs.map((log, index) => {
    const date = new Date(log.date);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()].toLowerCase();
    const formattedDate = `${day} de ${month}`;

    return (
      <VerticalTimelineElement
        key={index}
        className="patient-log"
        contentStyle={contentStyle}
        contentArrowStyle={{ display: "none" }}
        date={formattedDate}
        iconStyle={{ background: "#95B6BD", boxShadow: "0 0 0 #95B6BD" }}
        shadowSize="medium"
        iconClassName="patient-log-icon"
        dateClassName="patient-log-date"
      >
        <p>{log.log}</p>
        <div className="tags">
          {log.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </VerticalTimelineElement>
    );
  });

  const handleAddLog = (log) => {
    setPatientLogs([log, ...patientLogs]);
  };

  const handleGetMoreEntries = () => {
    API.getPatientJournal(id, page + 1)
      .then((res) => {
        setPage(page + 1);
        setPatientLogs([...patientLogs, ...res.data.journal]);
      })
      .catch((error) => {
        handleApiError(error);
        console.log(error);
      });
  };

  return (
    <div className={`patient-logs ${active}`}>
      <VerticalTimeline animate={false} layout="1-column-left">
        <VerticalTimelineElement
          className="patient-log"
          contentStyle={contentStyle}
          contentArrowStyle={{ display: "none" }}
          iconStyle={{ background: "#95B6BD" }}
          iconClassName="patient-log-add"
          shadowSize="medium"
          icon={<AddIcon />}
          iconOnClick={() => setIsModalOpen(true)}
        />

        {logs}

        <VerticalTimelineElement
          className="patient-log"
          iconStyle={{ background: "#035E7B" }}
          shadowSize="medium"
          iconClassName="patient-log-add"
          icon={<AddIcon />}
          iconOnClick={handleGetMoreEntries}
        />
      </VerticalTimeline>

      <AddPatientLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleAddLog={handleAddLog}
        id={id}
      />
    </div>
  );
}

export default PatientLogs;
