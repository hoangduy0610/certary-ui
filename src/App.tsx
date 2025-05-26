import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import { App as AntdApp } from 'antd';
import { UserInfoProvider, useUserInfo } from './hooks/useUserInfo';

function App() {

  return (
    <Router>
      <UserInfoProvider>
        <div className="App">
          <AntdApp>
            <AppRoute />
          </AntdApp>
        </div>
      </UserInfoProvider>
    </Router>
  );
}

export default App;
