import { useState } from "react";
import { Avatar, Link, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { LockOutlined, Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import useStyle from "./style";

const SignUp = () => {
  const classes = useStyle();
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
          Crea una cuenta
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
