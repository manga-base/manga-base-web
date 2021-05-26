import { useState } from "react";
import { Avatar, Box, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { LockOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useSnackbar } from "notistack";
import useStyle from "./style";

export default function Login() {
  const classes = useStyle();
  const history = useHistory();
  const { login } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const error = await login(email, password);
    setError(error);
    if (!error) {
      enqueueSnackbar("¡Bienvenido!", {
        variant: "success",
      });
      history.push("/");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            label="Correo electrónico o usuario"
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            helperText={error}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            label="Contraseña"
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} mb={2}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Button to="/register" color="primary" component={RouterLink}>
                Crear Cuenta
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Iniciar sesión
              </Button>
            </Grid>
          </Box>
        </form>
      </div>
    </Container>
  );
}
