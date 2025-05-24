import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home/home';
import MyCertificates from '../pages/My Certificates/my-certificates';
import Contact from '../pages/Contact/contact';
import CertificatesDetails from '../pages/Certificate Details/certificate-details';

// Admin Pages
import AdminLayout from '../pages/Admin/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import Users from '../pages/Admin/Users/Users';
import Certificates from '../pages/Admin/Certificates/Certificates';
import Organizations from '../pages/Admin/Organizations/Organizations';
import VerifyCertificate from '../pages/Admin/VerifyCertificate/VerifyCertificate';
import Forum from '../pages/Forum/forum';

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/my-certificates" element={<MyCertificates />} />
      <Route path="/certificate-details/:id" element={<CertificatesDetails />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Routes with Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="certificates/verify" element={<VerifyCertificate />} />
        <Route path="organizations" element={<Organizations />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoute;
