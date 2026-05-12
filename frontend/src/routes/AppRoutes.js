import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DocterSearch from '../pages/public/DocterSearch';
import BookAppointment from '../pages/patient/BookAppointment';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import ManagePatients from '../pages/admin/ManagePatients';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManageAppointments from '../pages/admin/ManageAppointments';
import PatientAppointments from '../pages/patient/PatientAppointments';
import GeneralBooking from '../pages/patient/GeneralBooking';
import ManageSupplies from '../pages/admin/ManageSupplies';
import ManagePayments from '../pages/staff/ManagePayments';
import RevenueReport from '../pages/staff/RevenueReport';
import PatientInvoices from '../pages/patient/PatientInvoices';
import Profile from '../pages/shared/Profile';
import DoctorDetail from '../pages/patient/DoctorDetail';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AppRoutes = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="page-fill d-flex align-items-center justify-content-center py-5">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DocterSearch />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/book/:doctorId" element={<BookAppointment />} />
            <Route path="/book" element={user?.role === 'patient' ? <GeneralBooking /> : <Navigate to="/login" />} />

            <Route path="/doctor-dashboard" element={user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
            <Route path="/staff-dashboard" element={user?.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />} />
            <Route path="/manage-patients" element={<ManagePatients />} />
            <Route path="/manage-doctors" element={<ManageDoctors />} />
            <Route path="/manage-appointments" element={<ManageAppointments />} />
            <Route path="/manage-supplies" element={<ManageSupplies />} />
            <Route path="/manage-payments" element={user?.role === 'staff' ? <ManagePayments /> : <Navigate to="/login" />} />
            <Route path="/revenue-report" element={user?.role === 'staff' ? <RevenueReport /> : <Navigate to="/login" />} />
            <Route path="/my-appointments" element={user?.role === 'patient' ? <PatientAppointments /> : <Navigate to="/login" />} />
            <Route path="/my-invoices" element={user?.role === 'patient' ? <PatientInvoices /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;

