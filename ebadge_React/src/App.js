import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UsersTab from "./pages/Dashboard/tabs/UsersTab";
import AdminLayout from "./pages/Dashboard/AdminLayout";
import PageProfile from "./composant/PageProfile";
import Classement from "./pages/Classement";
import Logout from "./pages/Logout";
import ProtectedRoute from "./policies/ProtectedRoute";
import Role from './policies/Role';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3949B5',
    },
    secondary: {
      main: '#FAC710',
    },
  },
  typography: {
    fontFamily: [
      'Barlow',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  console.log(process.env);

  //lors du chargement de la page, on vérifie si l'utilisateur est connecté
  useEffect(() => {
    console.log('App.js: useEffect');
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<PageProfile />} />
            <Route path="classement" element={<Classement />} />
            <Route path="*" element={<h1>404: Page non trouvée</h1>} />
          </Route>
          <Route path="/auth" >
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/logout" element={<Logout />} />
          </Route>
          <Route path="/admin" element={ProtectedRoute(Role.Teacher)}>
            <Route path="/admin" element={<AdminLayout />} >
              <Route path="/admin/users" element={<UsersTab />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
