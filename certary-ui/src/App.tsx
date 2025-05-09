import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/home';
import MyCertificates from './pages/My Certificates/my-certificates';
import Contact from './pages/Contact/contact';
import AdminDashboard from './pages/Admin/Dashboard/dashboard';
import AdminUsers from './pages/Admin/Users/users'
import AdminOrganization from './pages/Admin/Organizations/organizations';
import Certificates from './pages/Admin/Certificates/certificates';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-certificates" element={<MyCertificates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/organizations" element={<AdminOrganization />} />
          {/* <Route path="/verify" element={<Verify />} /> */}
          <Route path="/certificates" element={<Certificates />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
