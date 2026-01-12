import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== COMMON PAGES ===== */
import MainLayout from './layouts/MainLayout';
import Homepage from "./components/Pages/Homepage";
import DoctorsPage from "./components/Pages/DoctorsPage";
import ServicesPage from "./components/Pages/ServicesPage";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

/* ===== ADMIN & NURSE IMPORTS ===== */
import AdminDashboard from "./components/Admin/AdminDashboard"; 
import NurseDashboard from "./components/Nurse/NurseDashboard"; 

/* ===== DASHBOARD (General) ===== */
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
        {/* ===== PUBLIC ROUTES ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ===== ADMIN & NURSE ROUTES ===== */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />

        {/* ===== GENERIC DASHBOARD (BASE) ===== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===== DOCTOR SUB-ROUTES ===== */}
        {/* UC007 – View Appointments */}
        <Route
          path="/doctor/appointments"
          element={<Dashboard activeView="appointments" />}
        />
        
        {/* UC012 – Patient Management */}
        <Route
          path="/doctor/patients"
          element={<Dashboard activeView="patients" />}
        />

        {/* UC018 – AI Patient Summary (MỚI THÊM) */}
        <Route
          path="/doctor/ai-summary"
          element={<Dashboard activeView="ai-summary" />}
        />

        {/* ===== PATIENT SUB-ROUTES ===== */}
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

        {/* ===== SHARED / DETAIL ROUTES ===== */}
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