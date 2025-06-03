import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import PacienteView from "./pages/Paciente/PacienteView";
import Home from "./pages/Home/Home";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from './pages/Login/Login'

import Register from "./pages/Register/Register";
import Calendario from "./components/Calendario/Calendario";
import { GoogleApiProvider } from 'react-gapi'


const App = () => {
  return (
    <>
      <GoogleApiProvider clientId={"1042049294933-6706691g5vb2fgonludemk973v9mlgeb.apps.googleusercontent.com"}>
      <Router>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Login/>} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/paciente/:id" element={<PacienteView />} />
          <Route path="*" element={<PageNotFound />} /> 
          <Route path="/Calendario" element={<Calendario/>} />
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
      </GoogleApiProvider>
    </>
  );
};

export default App;
