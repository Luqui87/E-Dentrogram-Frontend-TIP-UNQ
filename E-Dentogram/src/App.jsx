import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import PacienteView from "./components/PacienteView";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

// function App() {

//   return (
//     <>
//     <Navbar/>
//     <PacienteView/>
//     </>
//   )
// }
