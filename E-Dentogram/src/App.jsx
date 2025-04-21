import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import PacienteView from "./pages/Paciente/PacienteView";
import Home from "./pages/Home/Home";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <>
      
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paciente/:id" element={<PacienteView />} />
          <Route path="/register" element= {<Register />} />
          <Route path="/login" element= {<Login/>} />
        </Routes>
        <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
      </Router>
    </>
  );
};

export default App;
