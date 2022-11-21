import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Test from './composant/Test';
import Layout from "./pages/Layout";
import Login from "./composant/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import BadgeCreateForm from "./composant/BadgeCreateForm";

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
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Test />} />
            <Route path="login" element={<Login />} />
            <Route path="createbadge" element={<BadgeCreateForm />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>

  );
}

export default App;
