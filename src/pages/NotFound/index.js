import { Paper, Typography, Container, Grid, Button } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import shuba from "./shuba-duck.gif";
import useStyle from "./style";

const NotFound = () => {
  const classes = useStyle();
  return (
    <Container>
      <Paper className={classes.notFoundContainer}>
        <Grid container>
          <Grid item sm={6} xs={12} className={classes.imageContainer}>
            <img src={shuba} alt="Shuba Duck" />
            <Typography align="center" variant="h1" className={classes.notFoundText}>
              Not Found
            </Typography>
          </Grid>
          <Grid item sm={6} xs={12} className={classes.notFoundRigth}>
            <Typography variant="h1" align="center" className={classes.NotFound}>
              404
            </Typography>
            <Typography color="textSecondary" align="left">
              Al parecer la página que buscas no existe, puedes quedarte a ver este bonito pato bailando o puedes...
            </Typography>
            <Button variant="contained" size="small" color="primary" component={RouterLink} to="/" className={classes.goHomeButton}>
              Volver al inicio
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NotFound;
