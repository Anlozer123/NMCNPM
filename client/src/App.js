import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Register from "./components/Auth/Register";
import DoctorAppointments from "./components/Doctor/Appointments/DoctorAppointments";
import Prescription from "./components/Patient/Prescription/Prescription";
import PatientAppointment from "./components/Patient/Appointment/PatientAppointments";
import RequestConsultation from "./components/Patient/RequestConsultation/RequestConsultation";
import Billing from "./components/Patient/Billing/Billing";
import BillingSuccess from "./components/Patient/Billing/BillingSuccess";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />

        {/* UC001 – Online Prescription Ordering */}
        <Route path="/prescription" element={<Prescription />} />

        {/* UC002 – Request Doctor Consultation */}
        <Route path="/request-consultation" element={<RequestConsultation />} />

        {/* UC003 – Register Appointment */}
        <Route path="/appointment" element={<PatientAppointment />} />

        
        <Route path="/billing" element={<Billing />} />
        <Route path="/billing-success" element={<BillingSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
