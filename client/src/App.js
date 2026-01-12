import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== COMMON PAGES ===== */
import Homepage from "./components/Pages/Homepage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

/* ===== DASHBOARD ===== */
import Dashboard from "./components/Dashboard/Dashboard";

/* ===== DOCTOR ===== */
import DoctorAppointments from "./components/Doctor/Appointments/DoctorAppointments";

/* ===== PATIENT ===== */
import Prescription from "./components/Patient/Prescription/Prescription";
import PatientAppointment from "./components/Patient/Appointment/PatientAppointments";
import RequestConsultation from "./components/Patient/RequestConsultation/RequestConsultation";
import Billing from "./components/Patient/Billing/Billing";
import BillingSuccess from "./components/Patient/Billing/BillingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== DASHBOARD ===== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===== DOCTOR ===== */}
        {/* Dùng Dashboard + activeView (theo tuan) */}
        <Route
          path="/doctor/appointments"
          element={<Dashboard activeView="appointments" />}
        />

        {/* ===== PATIENT ===== */}
        {/* UC001 – Online Prescription Ordering */}
        <Route path="/prescription" element={<Prescription />} />

        {/* UC002 – Request Doctor Consultation */}
        <Route
          path="/request-consultation"
          element={<RequestConsultation />}
        />

        {/* UC003 – Register Appointment */}
        <Route path="/appointment" element={<PatientAppointment />} />

        {/* Billing */}
        <Route path="/billing" element={<Billing />} />
        <Route path="/billing-success" element={<BillingSuccess />} />

        {/* ===== OPTIONAL / EXTEND ===== */}
        <Route
          path="/patient-profile/:id"
          element={<Dashboard activeView="patient-detail" />}
        />
        <Route
          path="/online-consultation"
          element={<Dashboard activeView="online-consultation" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
