import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UsersTab from "./pages/Dashboard/tabs/UsersTab";
import AdminLayout from "./pages/Dashboard/AdminLayout";
import PageProfile from "./composant/PageProfile";
import Classement from "./pages/Classement";

const theme = createTheme({
  palette: {
    primary: {
      main: '#3949B5',
    },
    secondary: {
      main: '#FAC710',
    },
  },
});

function App() {
  console.log(process.env);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PageProfile />} />
            <Route path="login" element={<Login />} />
            <Route path="classement" element={<Classement />} />
            <Route path="*" element={<h1>404: Page non trouvée</h1>} />
          </Route>
          <Route path="/admin" element={<AdminLayout />} >
            <Route path="/admin/users" element={<UsersTab/>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
