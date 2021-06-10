import { Link as RouterLink } from "react-router-dom";
import { Button, Paper, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const EmailVerified = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  return (
    <div className={[classes.mainContainer, classes.smallContainer].join(" ")}>
      <Paper className={classes.paper}>
        <div className={classes.emailVerificado}>
          <Typography variant="h4">¡Email verificado!</Typography>
          <Alert variant="filled" severity="success">
            Tu email ha sido verificado correctamente. Ahora ya puedes iniciar sesión.
          </Alert>
          <Button variant="contained" color="primary" size="large" component={RouterLink} to="/login">
            Inicia Sesión
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default EmailVerified;
