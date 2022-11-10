import logo from './logo.svg';
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Test />
      <Login />
      </ThemeProvider>
    </div>
  );
}

export default App;
