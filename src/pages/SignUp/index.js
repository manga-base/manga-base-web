import { useState } from "react";
import { Avatar, Link, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { LockOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import useStyle from "./style";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const classes = useStyle();
  const history = useHistory();
  const { signup } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setPasswordError(false);
    setUsernameError(false);
    setEmailError(false);

    const mensaje = await signup({ username, email, password, passwordConfirmation });
    if (mensaje) {
      const { field, msg } = mensaje;
      switch (field) {
        case "username":
          setUsernameError(msg);
          break;
        case "password":
          setPasswordError(msg);
          break;
        case "email":
          setEmailError(msg);
          break;
        case "default":
        default:
          enqueueSnackbar(msg, {
            variant: "error",
          });
          break;
      }
    } else {
      history.push("/");
      enqueueSnackbar("Se ha enviado una verificación al correo proporcionado, verifica tu correo para poder iniciar sesión", {
        variant: "info",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Crea una cuenta
        </Typography>
        <form className={classes.form} onSubmit={handleSignUp}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!emailError}
            label="Correo electrónico"
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!usernameError}
            label="Nombre de usuario"
            name="username"
            value={username}
            autoComplete="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            helperText={usernameError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!passwordError}
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
            helperText={passwordError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={!!passwordError}
            label="Confirma la Contraseña"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
            }}
            type={showPassword ? "text" : "password"}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Registrarse
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" component={RouterLink} variant="body2">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
