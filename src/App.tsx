import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import { App as AntdApp } from 'antd';

function App() {
  return (
    <Router>
      <div className="App">
        <AntdApp>
          <AppRoute />
        </AntdApp>
      </div>
    </Router>
  );
}

export default App;
