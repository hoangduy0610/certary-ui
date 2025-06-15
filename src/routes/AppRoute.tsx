import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home/home';
import MyCertificates from '../pages/MyCertificates/my-certificates';
import Contact from '../pages/Contact/contact';
import CertificatesDetails from '../pages/CertificateDetails/certificate-details';
import VerifyCertificate from '../pages/VerifyCertificate/verify-certificate';

// Admin Pages
import AdminLayout from '../pages/Admin/Layout/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import Users from '../pages/Admin/Users/Users';
import Certificates from '../pages/Admin/Certificates/Certificates';
import CertificateTypes from '../pages/Admin/CertificateType/CertificateType';
import Organizations from '../pages/Admin/Organizations/Organizations';

// Custom Certificate Pages
import CertificatesCustom from '../pages/Admin/CustomCertificate/certificate-custom';
import CertificateEditor from '../pages/Admin/CustomCertificate/certificate-editor';
import CertificatePreview from '../pages/Admin/CustomCertificate/certificate-preview';

import Forum from '../pages/Forum/forum';
import Login from '../pages/Login/login';
import Register from '../pages/Register/register';
import CertificateLayoutEditor from '../pages/Admin/CertificateLayoutEditor/CertificateLayoutEditor';

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/my-certificates" element={<MyCertificates />} />
      <Route path="/certificate-details/:id" element={<CertificatesDetails />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-certificate" element={<VerifyCertificate />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="certificates/verify" element={<VerifyCertificate />} />
        <Route path="certificate-types" element={<CertificateTypes />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="layout" element={<CertificateLayoutEditor />} />

        {/* Custom Certificate Routes */}
        <Route path="custom-certificates" element={<CertificatesCustom />} />
        <Route
          path="custom-certificates/editor/:id"
          element={
            <CertificateEditor
              template={{} as any} // TODO: Replace with actual template data or fetch logic and type
              onSave={() => { }} // Replace with actual save handler
              onCancel={() => { }} // Replace with actual cancel handler
            />
          }
        />
        <Route
          path="custom-certificates/preview/:id"
          element={
            <CertificatePreview
              template={{} as any} // TODO: Replace with actual template data or fetch logic and type
              onBack={() => { }} // Replace with actual back handler
              onEdit={() => { }} // Replace with actual edit handler
            />
          }
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoute;
