import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Noto Sans JP", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(","),
    button: {
      textTransform: "none",
    },
  },
  palette: {
    type: "dark",
    primary: {
      main: "#8fb339",
    },
    secondary: {
      main: "#b7ce63",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*::-webkit-scrollbar": {
          width: 16,
        },
        "*::-webkit-scrollbar-thumb": {
          height: 56,
          borderRadius: 8,
          border: "4px solid transparent",
          backgroundClip: "content-box",
          backgroundColor: "#909090",
        },
      },
    },
  },
});

export default theme;
