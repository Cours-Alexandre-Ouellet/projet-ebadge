import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import UsersTab from "./pages/Dashboard/tabs/UsersTab";
import UsersAdminTab from "./pages/Dashboard/tabs/UsersAdminTab";
import AdminLayout from "./pages/Dashboard/AdminLayout";
import PageProfile from "./composant/PageProfile";
import Leaderboard from "./pages/Leaderboard";
import BadgesTab from "./pages/Dashboard/tabs/BadgesTab";
import CategoriesTab from "./pages/Dashboard/tabs/CategoriesTab";
import Logout from "./pages/Logout";
import ProtectedRoute from "./policies/ProtectedRoute";
import Role from "./policies/Role";
import Signup from "./pages/Signup/Signup";
import { BadgeListContextProvider } from "./context/BadgeListContext";
import Stats from "./pages/Dashboard/tabs/Stats"; 
import ListeBadge from "./pages/ListeBadge";
import TeacherCodesTab from "./pages/Dashboard/tabs/TeacherCodesTab";
import PageUser from "./pages/PageUser";
import DefaultTheme from "./theme";
import PageProfileModify from "./composant/Forms/PageProfileModify";
import Contact from "./pages/Contact";
import TopCollectors from './pages/Admin/TopCollectors';
import TopByCategory from './pages/Admin/TopByCategory';

const estConnecter = localStorage.getItem("token");

function App() {

  return (
    <>
      <BrowserRouter>
        <DefaultTheme>
          <BadgeListContextProvider>
            <Routes>
              <Route path="/" element={estConnecter ? <Layout /> : <Login />}>
                <Route index path="/" element={<PageProfile />} />
                <Route path="/modify-profile" element={<PageProfileModify/>}/>
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="contactez-nous" element={<Contact />} />
                <Route path="badges" element={<ListeBadge />} />
                <Route path="utilisateur/:id" element={<PageUser />} />
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
                  <Route path="/admin/admin_users" element={<UsersAdminTab />} />
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
        </BadgeListContextProvider>
      </DefaultTheme>
    </BrowserRouter>
  </>
  );
}

export default App;
