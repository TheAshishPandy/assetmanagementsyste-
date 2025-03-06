'use client';

import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, TextField, Button, Typography, CssBaseline, Box } from '@mui/material';
import Image from 'next/image'; // Use Next.js Image component for assets
import backgroundImg from '/public/background.jpg';
import homepageGif from '/public/homepage.gif'; // Import GIF directly as a file

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
});

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  // Move handleLogin inside the component
  const handleLogin = () => {
    if (email === "admin" && password === "abc123") {
      onLoginSuccess(); // Call function to switch to MenuPage
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          style={{ animation: 'fadeIn 3s ease-in-out' }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Transparent background with some opacity
            backdropFilter: 'blur(10px)', // Apply blur effect
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            position: 'absolute',
            right: 0, // Position the form on the right side
            marginRight: '5%',
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Login
          </Typography>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            value={email} // Controlled input
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={password} // Controlled input
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin} // Now correctly calls the function
          >
            Sign In
          </Button>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            left: 0, // Position the GIF on the left sides
            top: '50%',
            transform: 'translateY(-50%)',
            width: '30%', // Make the GIF larger by scaling its width
            height: 'auto', // Maintain aspect ratio
          }}
        >
          {/* Use the Next.js Image component for the static GIF */}
          <Image
            src={homepageGif}
            alt="Animated GIF"
            layout="responsive"
            width={800}  // Increase the width to make it larger
            height={600} // Adjust the height accordingly to maintain aspect ratio
          />
        </Box>
      </Box>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </ThemeProvider>
  );
}
