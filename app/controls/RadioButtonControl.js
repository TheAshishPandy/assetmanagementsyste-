import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "@/context/themecontext";

export default function RadioButtonControl({ label, value, onChange, options }) {
  const { themeMode } = useContext(ThemeContext); // Get the theme mode

  return (
    <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
      <FormLabel component="legend" sx={{ color: themeMode === "light" ? "#000" : "#fff" }}>
        {label}
      </FormLabel>
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio sx={{ color: themeMode === "light" ? "#000" : "#fff" }} />}
            label={option.label}
            sx={{
              color: themeMode === "light" ? "#000" : "#fff",
              "& .Mui-checked": {
                color: themeMode === "light" ? "#1976d2" : "#fff",
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
