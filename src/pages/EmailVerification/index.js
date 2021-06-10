import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Link, Paper, Typography } from "@material-ui/core";
import useGlobalStyle from "../../style";
import useStyle from "./style";
import logo from "../../logo.svg";

const EmailVerification = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const location = useLocation();
  const history = useHistory();

  if (!location.state || !location.state.correo) {
    history.push("/");
    return <></>;
  }

  return (
    <div className={[classes.mainContainer, classes.smallContainer].join(" ")}>
      <Paper className={classes.paper}>
        <div className={classes.tituloRegistro}>
          <Typography variant="h4">¡Gracias por registrarte!</Typography>
          <img src={logo} alt="Logo" style={{ height: 80 }} />
        </div>
        <Typography variant="h6">
          Para completar el registro necesitamos que verifiques tu correo electrónico{" "}
          <Typography component="span" variant="h6" color="primary">
            {location.state.correo}
          </Typography>{" "}
          . Comprueba el correo, te hemos enviado una verificación.
        </Typography>
        <br />
        <ul>
          <Typography component="li">
            Si has creado una cuenta y no te ha llegado ningún correo &nbsp;
            <Link color="primary" component={RouterLink} to="/contact">
              contacta con nosotros
            </Link>
            . Y perdona las molestias.
          </Typography>
          <Typography component="li">
            Si ya has verificado tu cuenta inicia sesión &nbsp;
            <Link color="primary" component={RouterLink} to="/login">
              aquí
            </Link>
            .
          </Typography>
        </ul>
      </Paper>
    </div>
  );
};

export default EmailVerification;
