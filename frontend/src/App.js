import React from 'react';
import Navbar from './components/Navbar';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DomainPage from './pages/DomainPage.js';
import AllDomains from './pages/AllDomains';

const theme = createTheme({
  palette: {
    mode: 'light',
    action: {
      hover: 'rgba(0, 0, 0, 0.06)'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box sx={{ display: 'flex' }}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/domains" element={<AllDomains />} />
              <Route path="/domains/:domainName" element={<DomainPage />} />
            </Routes>
          </Router>
        </Box>
      </CssBaseline>
    </ThemeProvider >
  )
}

export default App;
