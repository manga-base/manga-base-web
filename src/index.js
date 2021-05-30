import ReactDOM from "react-dom";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import { UserProvider } from "./context/UserContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import { SnackbarProvider } from "notistack";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <UserProvider>
          <CssBaseline />
          <App />
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
