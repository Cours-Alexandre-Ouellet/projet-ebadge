import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Test from './composant/Test';
import Layout from "./pages/Layout";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BadgeCreateForm from "./composant/BadgeCreateForm";
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
            <Route index element={<Test />} />
            <Route path="login" element={<Login />} />
            <Route path="createbadge" element={<BadgeCreateForm />} />
            <Route path="classement" element={<Classement />} />
            <Route path="*" element={<h1>404: Page non trouvée</h1>} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
