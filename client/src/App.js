import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ===== COMMON PAGES ===== */
// Lưu ý: Đảm bảo file Homepage.js nằm đúng trong ./components/Pages/
import MainLayout from './layouts/MainLayout';
import Homepage from "./components/Pages/Homepage";
import DoctorsPage from "./components/Pages/DoctorsPage";
import ServicesPage from "./components/Pages/ServicesPage";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

/* ===== ADMIN & NURSE IMPORTS (MỚI) ===== */
// Dựa trên ảnh: src/components/Admin/AdminDashboard.js
import AdminDashboard from "./components/Admin/AdminDashboard"; 
// Dựa trên ảnh: src/components/Nurse/NurseDashboard.js
import NurseDashboard from "./components/Nurse/NurseDashboard"; 

/* ===== DASHBOARD (General) ===== */
import Dashboard from "./components/Dashboard/Dashboard";

/* ===== DOCTOR ===== */
import DoctorAppointments from "./components/Doctor/Appointments/DoctorAppointments"; // Kiểm tra lại đường dẫn này nếu cần

/* ===== PATIENT ===== */
import Prescription from "./components/Patient/Prescription/Prescription";
import PatientAppointment from "./components/Patient/Appointment/PatientAppointments"; // Kiểm tra tên file chính xác
import RequestConsultation from "./components/Patient/RequestConsultation/RequestConsultation";
import Billing from "./components/Patient/Billing/Billing";
import BillingSuccess from "./components/Patient/Billing/BillingSuccess";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* ===== ADMIN ROUTE (MỚI) ===== */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ===== NURSE ROUTE (MỚI) ===== */}
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />

        {/* ===== GENERIC DASHBOARD ===== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===== DOCTOR ===== */}
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