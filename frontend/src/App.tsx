import React from 'react';
import Navbar from './components/Navbar';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box sx={{ display: 'flex' }}>
          <Navbar />
          <Dashboard />
        </Box>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App;
