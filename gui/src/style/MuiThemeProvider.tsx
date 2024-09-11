import {createTheme} from "@mui/material/styles";
import type {} from "@mui/x-date-pickers/themeAugmentation";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#a56eff",
    },
  },
  components: {
    MuiPickersToolbar: {
      styleOverrides: {
        root: {
          color: "#ad1457",
          borderRadius: "0px",
          borderWidth: "1px",
          borderColor: "#2196f3",
          border: "0px solid",
          backgroundColor: "#90caf9",
        },
      },
    },
  },
});
