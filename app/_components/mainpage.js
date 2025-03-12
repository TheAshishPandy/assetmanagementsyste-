"use client";

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Image from "next/image";
import backgroundImg from "/public/mainimage.jpg";
import RoleManagement from "../master/rolemaster/page";
import PortMaster from "../master/portmaster/page";
import UserProfile from "../user/userprofile/page.js";
import MenuPage from "./menu";

export default function MainPage() {
  const pathname = usePathname();

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
     <MenuPage/>
      {pathname === "/user/userprofile" && <UserProfile />}

      {/* Show RoleManagement when the URL is /master/roleMaster */}
      {pathname === "/master/rolemaster" && <RoleManagement />}
      {pathname === "/master/portmaster" && <PortMaster />}
      {/* Show Background Image for all other routes */}
      {(pathname === "/" || pathname === "/home") && (
        <Box
          sx={{
            position: "fixed",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: -1,
          }}
        >
          <Image src={backgroundImg} alt="Background" layout="fill" objectFit="cover" />
        </Box>
      )}
    </Box>
  );
}
