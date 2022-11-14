import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Test from './composant/Test';
import Layout from "./pages/Layout";
import Login from "./composant/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Test />} />
          <Route path="login" element={<Login />} />          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
