import { useContext } from "react";
import { ThemeContext } from "@/context/themecontext";
import { Typography } from "@mui/material";

export default function LabelControl({ text, variant = "h6", align = "left" }) {
  const { themeMode } = useContext(ThemeContext);

  return (
    <Typography
      variant={variant}
      align={align}
      sx={{
        marginBottom: 1,
        fontWeight: "bold",
        color: themeMode === "light" ? "black" : "white",
      }}
    >
      {text}
    </Typography>
  );
}
