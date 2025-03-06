import { useContext } from "react";
import { ThemeContext } from "@/context/themecontext";
import { FormControlLabel, Switch } from "@mui/material";

export default function ToggleControl({ label, checked, onChange }) {
  const { themeMode } = useContext(ThemeContext);

  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={onChange}
          sx={{
            "& .MuiSwitch-thumb": {
              backgroundColor: themeMode === "light" ? "#1976d2" : "#90caf9",
            },
          }}
        />
      }
      label={label}
      sx={{ color: themeMode === "light" ? "black" : "white" }}
    />
  );
}
