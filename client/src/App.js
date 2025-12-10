import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Register from "./components/Auth/Register";
import DoctorAppointments from "./components/Doctor/Appointments/DoctorAppointments";
import Prescription from "./components/Patient/Prescription/Prescription";
import PatientAppointment from "./components/Patient/Appointment/PatientAppointment";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />

        {/* UC1 – Online Prescription Ordering */}
        <Route path="/prescription" element={<Prescription />} />
        {/* UC003 – Register Appointment */}
        <Route path="/appointment" element={<PatientAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;
