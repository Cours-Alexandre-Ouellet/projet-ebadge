import './App.css';
import Test from './composant/Test';
import Login from './composant/Login';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
    <div className="App">
      <ThemeProvider theme={theme}>
      <header className="App-header">
        Page Profil
      </header>
      <Test />
      <Login />
      </ThemeProvider>
    </div>
  );
}

export default App;
