import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './helpers/PrivateRoute';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from "./Keycloak";
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoute from './helpers/AdminRoute';
import AccountDetails from './components/AccountDetails';
import Search from './components/Search';

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak} initOptions={{ pkceMethod: 'S256'}}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/MainPage" element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            } />
            <Route path="/AccountDetails" element={
              <PrivateRoute>
                <AccountDetails />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            <Route path="/search/*" element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
