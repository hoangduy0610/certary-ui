import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import { comparePathname } from '../../utils/uri';


const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("");

  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const routes = [
    {
      title: 'Location',
      link: '/admin/location',
      icon: 'fas fa-map-marker-alt',
    },
    {
      title: 'Service',
      link: '/admin/service',
      icon: 'fas fa-cogs',
    },
    {
      title: 'Service Type',
      link: '/admin/service-type',
      icon: 'fas fa-layer-group',
    },
    {
      title: 'Plan',
      link: '/admin/plan',
      icon: 'fas fa-calendar-alt',
    },
    {
      title: 'Blog',
      link: '/admin/blog',
      icon: 'fas fa-blog',
    },
    {
      title: 'Forum',
      link: '/admin/forum',
      icon: 'fas fa-comments',
    },
    {
      title: 'User',
      link: '/admin/user',
      icon: 'fas fa-user',
    },
    {
      title: 'Review',
      link: '/admin/review',
      icon: 'fas fa-star',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="d-flex flex-column align-items-center w-100 min-vh-100 h-100 sidebar px-2">
      <h1 className="logo">
        {/* <img src={require("@/assets/logo.jpg")} alt="Logo" style={{ height: 150, width: 'auto' }} /> */}
      </h1>
      <h5 className="systems">Navigation Systems</h5>
      <ul className="nav nav-pills d-flex flex-column w-100">
        {routes.map((route, index) => {
          const isActive = comparePathname(currentPath, route.link);

          return (
            <li key={index} className="flex-1 nav-item">
              <Link
                to={route.link}
                className={`nav-link ${isActive ? "nav-link-active" : "text-dark"}`}
              >
                <span className="icon-circle">
                  <i className={route.icon}></i>
                </span>
                <span
                  className={`title ${isActive ? "title-active" : "text-dark"}`}
                >
                  {route.title}
                </span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1 nav-item">
          <Link
            to="#"
            onClick={handleLogout}
            className="nav-link text-dark"
          >
            <span className="icon-circle">
              <i className="fas fa-right-from-bracket"></i>
            </span>
            <span className="title text-dark">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
