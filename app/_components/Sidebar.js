"use client";

import { useRouter, usePathname } from "next/navigation";
import { Box, Drawer, List, ListItem, ListItemText, Collapse, IconButton, Divider } from "@mui/material";
import { Home, Storage, ExpandMore, ExpandLess, Person } from "@mui/icons-material";
import Image from "next/image";
import fullLogo from "/public/full-logo.jpg";
import smallLogo from "/public/small-logo.jpg";

const Sidebar = ({ open, toggleSidebar, openMasterMenu, setOpenMasterMenu, openServicesMenu, setOpenServicesMenu }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? 240 : 60,
          transition: "width 0.3s ease-in-out",
          boxSizing: "border-box",
          overflowX: "hidden",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {/* Logo with Click Event */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "center" : "flex-start", padding: 2, cursor: "pointer" }} onClick={toggleSidebar}>
        <Image src={open ? fullLogo : smallLogo} alt="Logo" width={open ? 150 : 40} height={40} />
      </Box>

      <Divider />

      {/* Menu Items */}
      <List>
        {/* Master Menu */}
        <ListItem button onClick={() => setOpenMasterMenu(!openMasterMenu)}>
          <IconButton>
            <Home />
          </IconButton>
          {open && <ListItemText primary="Master" />}
          {openMasterMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMasterMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} onClick={() => router.push("/master/rolemaster")} selected={pathname === "/master/rolemaster"}>
              <ListItemText primary="Role Master" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} onClick={() => router.push("/master/portmaster")} selected={pathname === "/master/portmaster"}>
              <ListItemText primary="Port Master" />
            </ListItem>
          </List>
        </Collapse>

        <Divider />

        {/* User Menu */}
        <ListItem button onClick={() => setOpenServicesMenu(!openServicesMenu)}>
          <IconButton>
            <Home />
          </IconButton>
          {open && <ListItemText primary="User Mangement" />}
          {openServicesMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openServicesMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} onClick={() => router.push("/user/userprofile")} selected={pathname === "/services/userprofile"}>
              <ListItemText primary="User Profile" />
            </ListItem>
          </List>
        </Collapse>


        <Divider />

         {/* Services Menu */}
         <ListItem button onClick={() => setOpenServicesMenu(!openServicesMenu)}>
          <IconButton>
            <Storage />
          </IconButton>
          {open && <ListItemText primary="Services" />}
          {openServicesMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openServicesMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} onClick={() => router.push("/services/storage")} selected={pathname === "/services/storage"}>
              <ListItemText primary="Storage" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
