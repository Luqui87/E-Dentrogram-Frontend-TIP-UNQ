import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import PacienteView from "./pages/Paciente/PacienteView";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/paciente/:id" element={<PacienteView />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
