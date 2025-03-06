import { Button } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "@/context/themecontext";

export default function ButtonControl({ label, onClick, variant = "contained" }) {
  const { themeMode } = useContext(ThemeContext); // Get the theme mode

  return (
    <Button
      variant={variant}
      onClick={onClick}
      sx={{
        backgroundColor: themeMode === "light" ? "#1976d2" : "#3f51b5",
        color: "#fff",
        "&:hover": {
          backgroundColor: themeMode === "light" ? "#1565c0" : "#303f9f",
        },
      }}
    >
      {label}
    </Button>
  );
}