import { Button, styled } from "@mui/material";
import { COLORS } from "../../lib/constants/styles.ts";

export const CustomButton = styled(Button)({
  borderRadius: "8px",
  textTransform: "none",
  padding: "10px 24px",
  fontSize: "16px",
  fontWeight: 500,
  boxShadow: "none",
  "&.MuiButton-contained": {
    backgroundColor: COLORS.primary,
    color: "#fff",
    "&:hover": {
      backgroundColor: COLORS.primaryDark,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    "&:disabled": {
      backgroundColor: COLORS.disabled,
      color: COLORS.text.secondary,
    },
  },
  "&.MuiButton-outlined": {
    borderColor: COLORS.primary,
    color: COLORS.primary,
    "&:hover": {
      borderColor: COLORS.primaryDark,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&:disabled": {
      borderColor: COLORS.disabled,
      color: COLORS.text.secondary,
    },
  },
  "&.MuiButton-text": {
    color: COLORS.primary,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&:disabled": {
      color: COLORS.text.secondary,
    },
  },
}) as typeof Button;

// Example usage:
// <CustomButton variant="contained">Primary Button</CustomButton>
// <CustomButton variant="outlined">Outlined Button</CustomButton>
// <CustomButton variant="text">Text Button</CustomButton>
