// components/MenuPage.js
'use client';

import { useState } from 'react';
import { ThemeProvider, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Sidebar from './Sidebar';
import TopStrip from './TopStrip';

export default function MenuPage() {
  const [themeMode, setThemeMode] = useState('light');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const [openMasterMenu, setOpenMasterMenu] = useState(false);
  const [openServicesMenu, setOpenServicesMenu] = useState(false);
  const [open, setOpen] = useState(true); // Sidebar open/close state
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const toggleTheme = () => setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  const handleToggleSidebar = () => setOpen((prevOpen) => !prevOpen);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex',}}>
        {/* Sidebar */}
        <Sidebar
          open={open}
          toggleSidebar={handleToggleSidebar}
          openMasterMenu={openMasterMenu}
          setOpenMasterMenu={setOpenMasterMenu}
          openServicesMenu={openServicesMenu}
          setOpenServicesMenu={setOpenServicesMenu}
        />

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            transition: 'margin-left 0.3s',
          }}
        >
          {/* Top Strip */}
          <TopStrip
            theme={theme}
            themeMode={themeMode}
            toggleTheme={toggleTheme}
            userMenuAnchor={userMenuAnchor}
            setUserMenuAnchor={setUserMenuAnchor}
          />

        </Box>
      </Box>
    </ThemeProvider>
  );
}
