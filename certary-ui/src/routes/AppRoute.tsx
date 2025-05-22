import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import Home from '../pages/Home/home';
import MyCertificates from '../pages/My Certificates/my-certificates';
import Contact from '../pages/Contact/contact';

// Admin Pages
import AdminLayout from '../pages/Admin/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import Users from '../pages/Admin/Users/Users';
import Certificates from '../pages/Admin/Certificates/Certificates';
import Organizations from '../pages/Admin/Organizations/Organizations';

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/my-certificates" element={<MyCertificates />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Routes with Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="organizations" element={<Organizations />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoute;
