// components/TopStrip.js
'use client';

import { Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Brightness4, Brightness7, Lock, Logout } from '@mui/icons-material';
import { useContext } from 'react';
import { ThemeContext } from '@/context/themecontext'; // Import ThemeContext

const TopStrip = () => {
  const { themeMode, toggleTheme, userMenuAnchor, setUserMenuAnchor } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        height: '48px',
        backgroundColor: themeMode === 'light' ? '#f5f5f5' : '#121212',
        boxShadow: 2,
      }}
    >
      {/* Theme Toggle */}
      <IconButton onClick={toggleTheme} color="inherit">
        {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>

      {/* User Menu */}
      <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)}>
        <Avatar sx={{ bgcolor: themeMode === 'light' ? '#1976d2' : '#ff5722' }} />
      </IconButton>
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
      >
        <MenuItem onClick={() => alert('Change Password')}>
          <Lock sx={{ marginRight: 1 }} />
          Change Password
        </MenuItem>
        <MenuItem onClick={() => alert('Logout')}>
          <Logout sx={{ marginRight: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TopStrip;
