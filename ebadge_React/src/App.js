import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UsersTab from "./pages/Dashboard/tabs/UsersTab";
import AdminLayout from "./pages/Dashboard/AdminLayout";
import PageProfile from "./composant/PageProfile";
import Leaderboard from "./pages/Leaderboard";
import BadgesTab from "./pages/Dashboard/tabs/BadgesTab";
import CategoriesTab from "./pages/Dashboard/tabs/CategoriesTab";
import Logout from "./pages/Logout";
import ProtectedRoute from "./policies/ProtectedRoute";
import Role from "./policies/Role";
import Signup from "./pages/Signup/Signup";

import ListeBadge from "./pages/ListeBadge";
//import ProgramTab from "./pages/Dashboard/tabs/ProgramTab";
//import OrganisationTab from "./pages/Dashboard/tabs/OrganisationTab";
import TeacherCodesTab from "./pages/Dashboard/tabs/TeacherCodesTab";
import PageVisiteUtilisateur from "./pages/PageVisiteUtilisateur";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3949B5",
    },
    secondary: {
      main: "#FAC710",
    },
  },
  typography: {
    fontFamily: ["Barlow", "sans-serif"].join(","),
  },
});

const estConnecter = localStorage.getItem("token");

function App() {
  console.log(process.env);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={estConnecter ? <Layout /> : <Login />}>
            <Route index path="/" element={<PageProfile />} />

            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="badges" element={<ListeBadge />} />
            <Route path="utilisateur/:id" element={<PageVisiteUtilisateur />} />
            <Route path="*" element={<h1>404: Page non trouvée</h1>} />
          </Route>
          <Route path="/auth">
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/logout" element={<Logout />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          <Route path="/admin" element={ProtectedRoute(Role.Teacher)}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="/admin/users" element={<UsersTab />} />
              <Route path="/admin/badges" element={<BadgesTab />} />
              <Route path="/admin/categories" element={<CategoriesTab />} />
              <Route
                path="/admin/teacher_codes"
                element={ProtectedRoute(Role.Admin)}
              >
                <Route
                  path="/admin/teacher_codes"
                  element={<TeacherCodesTab />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
