import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== COMMON PAGES ===== */
import MainLayout from './layouts/MainLayout';
import Homepage from "./components/Pages/Homepage";
import DoctorsPage from "./components/Pages/DoctorsPage";
import ServicesPage from "./components/Pages/ServicesPage";

/* ===== AUTH IMPORTS ===== */
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PatientDetails from "./components/Auth/PatientDetails";

/* ===== ADMIN & NURSE IMPORTS ===== */
import AdminDashboard from "./components/Admin/AdminDashboard"; 
import NurseDashboard from "./components/Nurse/NurseDashboard"; 

/* ===== DASHBOARD (General) ===== */
import Dashboard from "./components/Dashboard/Dashboard";

/* ===== PATIENT IMPORTS ===== */
import Prescription from "./components/Patient/Prescription/Prescription";
import PatientAppointment from "./components/Patient/Appointment/PatientAppointments";
import RequestConsultation from "./components/Patient/RequestConsultation/RequestConsultation";
import Billing from "./components/Patient/Billing/Billing";
import BillingSuccess from "./components/Patient/Billing/BillingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ROUTES (Wrapped in MainLayout) ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* [MỚI] Route cho bước 2 đăng ký: Hoàn tất hồ sơ */}
          <Route path="/patient-details" element={<PatientDetails />} />
        </Route>

        {/* ===== ADMIN ROUTE ===== */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ===== NURSE ROUTE ===== */}
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />

        {/* ===== GENERIC DASHBOARD & DOCTOR ROUTES ===== */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route
          path="/doctor/appointments"
          element={<Dashboard activeView="appointments" />}
        />
        <Route
          path="/doctor/patients"
          element={<Dashboard activeView="patients" />}
        />
        <Route
          path="/doctor/ai-summary"
          element={<Dashboard activeView="ai-summary" />}
        />

        {/* ===== PATIENT FUNCTIONALITIES ===== */}
        <Route path="/prescription" element={<Prescription />} />
        
        <Route
          path="/request-consultation"
          element={<RequestConsultation />}
        />
        
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