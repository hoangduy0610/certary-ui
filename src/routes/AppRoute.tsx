import { Route, Routes } from 'react-router-dom';

import Certificates from '../pages/Admin/Certificates/Certificates';
import CertificatesCustom from '../pages/Admin/CustomCertificate/certificate-custom';
import Dashboard from '../pages/Admin/Dashboard/Dashboard';
import ForumCategoryPage from '../pages/Admin/ForumCategory/ForumCategory';
import AdminLayout from '../pages/Admin/Layout/AdminLayout';
import Organizations from '../pages/Admin/Organizations/Organizations';
import Users from '../pages/Admin/Users/Users';
import CertificatesDetails from '../pages/CertificateDetails/certificate-details';
import ClaimCertificate from '../pages/ClaimCertificate/claim-certificate';
import Contact from '../pages/Contact/contact';
import Forum from '../pages/Forum/forum';
import Home from '../pages/Home/home';
import IssuerRegister from '../pages/IssuerRegister/issuer-register';
import Login from '../pages/Login/login';
import ForgotPassword from '../pages/ForgotPassword/ForgotPasswordForm';
import MyCertificates from '../pages/MyCertificates/my-certificates';
import Register from '../pages/Register/register';
import VerifyCertificate from '../pages/VerifyCertificate/verify-certificate';
import ConnectWalletPage from '../pages/Welcome/ConnectWallet';
import OnboardingPage from '../pages/Welcome/Onboarding';
import WelcomePage from '../pages/Welcome/welcome';
import MyProfile from '../pages/MyProfile/my-profile';
import ResetPassword from '../pages/ForgotPassword/ResetPasswordForm';

const AppRoute = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/issuer-register" element={<IssuerRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/my-certificates" element={<MyCertificates />} />
      <Route path="/claim-certificate" element={<ClaimCertificate />} />
      <Route path="/certificate-details/:id" element={<CertificatesDetails />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify-certificate" element={<VerifyCertificate />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/connect-wallet" element={<ConnectWalletPage />} />
      <Route path="/" element={<WelcomePage />} />


      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="custom-certificates" element={<CertificatesCustom />} />
        <Route path="forum-category" element={<ForumCategoryPage />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoute;
