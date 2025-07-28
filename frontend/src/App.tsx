import { useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Button, Typography, useMediaQuery, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Home } from './pages/Home';
import { About } from './pages/About';
import Accounts from './pages/accounts/Accounts';

export default function App() {  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: prefersDarkMode ? '#f48fb1' : '#dc004e',
          },
          background: {
            default: prefersDarkMode ? '#121212' : '#f5f5f5',
            paper: prefersDarkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar navigation */}
      <Box
        component="nav"
        sx={{
          width: 200,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Button component={Link} to="/" variant="outlined">
          Home
        </Button>
        <Button component={Link} to="/about" variant="outlined">
          About
        </Button>
        <Button component={Link} to="/accounts" variant="outlined">
          Accounts
        </Button>
      </Box>

      {/* Page content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 2,
            p: 3,
            minHeight: '100%',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="*" element={<Typography>Page Not Found</Typography>} />
          </Routes>
        </Box>
      </Box>
    </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}
