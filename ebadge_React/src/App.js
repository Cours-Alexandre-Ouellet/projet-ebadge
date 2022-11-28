import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Test from './composant/Test';
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UsersTab from "./pages/dashboard/tabs/UsersTab";
import AdminLayout from "./pages/dashboard/AdminLayout";

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
            <Route index element={<Test />} />
            <Route path="login" element={<Login />} />
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
