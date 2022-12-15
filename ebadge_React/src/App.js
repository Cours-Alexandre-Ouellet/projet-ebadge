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
import BadgesTab from "./pages/Dashboard/tabs/BadgesTab";
import Logout from "./pages/Logout";
import ProtectedRoute from "./policies/ProtectedRoute";
import Role from './policies/Role';
import Signup from "./pages/Signup/Signup";
import ProgramTab from "./pages/Dashboard/tabs/ProgramTab";
import OrganisationTab from "./pages/Dashboard/tabs/OrganisationTab";

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
            <Route path="signup" element={<Signup />} />

          </Route>
          <Route path="/admin" element={ProtectedRoute(Role.Teacher)}>
            <Route path="/admin" element={<AdminLayout />} >
              <Route path="/admin/users" element={<UsersTab />} />
              <Route path="/admin/badges" element={<BadgesTab />} />
              <Route path="/admin/programs" element={ProtectedRoute(Role.Admin)}>
                <Route path="/admin/programs" element={<ProgramTab />} />
              </Route> 
              <Route path="/admin/organisations" element={ProtectedRoute(Role.Admin)}>
                <Route path="/admin/organisations" element={<OrganisationTab />} />
              </Route>       
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
