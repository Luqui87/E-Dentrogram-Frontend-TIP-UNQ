import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import PacienteView from "./pages/Paciente/PacienteView";
import Home from "./pages/Home/Home";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

import Register from "./pages/Register/Register";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/paciente/:id" element={<PacienteView />} />
          <Route path="*" element={<PageNotFound />} /> 
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
