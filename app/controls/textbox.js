import { useContext } from "react";
import { ThemeContext } from "@/context/themecontext";
import { TextField, Box, Typography } from "@mui/material";

export default function TextboxControl({ label, value, onChange, placeholder = "", required = false,multiline=false,rows }) {
  const { themeMode } = useContext(ThemeContext);

  return (
    <Box sx={{ marginBottom: 2 }}>
      {label && (
        <Typography variant="body2" sx={{ marginBottom: 1, color: themeMode === "light" ? "black" : "white" }}>
          {label}
        </Typography>
      )}
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        multiline={multiline}
        rows={rows}
        sx={{
          "& .MuiInputBase-input": { color: themeMode === "light" ? "#000" : "#fff" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: themeMode === "light" ? "#ccc" : "#fff" },
            "&:hover fieldset": { borderColor: "#1976d2" },
          },
        }}
      />
    </Box>
  );
}
