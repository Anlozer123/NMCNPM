import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './Homepage.css';

/* ===== COMMON PAGES ===== */
import MainLayout from './layouts/MainLayout';
import Homepage from "./components/Pages/Homepage";
import DoctorsPage from "./components/Pages/DoctorsPage";
import ServicesPage from "./components/Pages/ServicesPage";

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
        {/* ===== NHÓM 1: TRANG CÔNG KHAI (CÓ HEADER/FOOTER) ===== */}
        {/* Homepage phải nằm trong này mới có Header/Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ===== NHÓM 2: TRANG RIÊNG (KHÔNG CÓ HEADER CŨ) ===== */}
        

        {/* ===== DASHBOARD ===== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===== DOCTOR ===== */}
        <Route
          path="/doctor/appointments"
          element={<Dashboard activeView="appointments" />}
        />

        {/* ===== PATIENT ===== */}
        <Route path="/prescription" element={<Prescription />} />
        <Route path="/request-consultation" element={<RequestConsultation />} />
        <Route path="/appointment" element={<PatientAppointment />} />
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