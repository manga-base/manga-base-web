import { useState } from "react";
import { Avatar, Box, Button, Container, Grid, IconButton, InputAdornment, makeStyles, TextField, Typography } from "@material-ui/core";
import { LockOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const { signup } = useUser();

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    } else {
      setError("");
    }
    const error = await signup({ username, email, password, passwordConfirmation });
    setError(error);
    if (!error) history.push("/");
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrate
        </Typography>
        <form className={classes.form} onSubmit={handleSignUp}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            label="Correo electrónico"
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
            label="Nombre de usuario"
            name="username"
            value={username}
            autoComplete="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            label="Confirma la Contraseña"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
            }}
            type={showPassword ? "text" : "password"}
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
};

export default SignUp;
