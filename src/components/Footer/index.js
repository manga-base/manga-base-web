import { IconButton, Link, Typography } from "@material-ui/core";
import { SupervisorAccount } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import useGlobalStyle from "../../style";
import useStyle from "./style";

export default function Footer() {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  return (
    <div className={classes.footer}>
      <div className={classes.footerContent}>
        <Typography variant="caption">©2021 Manga Base.</Typography>
        &nbsp;·&nbsp;
        <Link variant="caption" color="inherit" to="/contact" component={RouterLink}>
          Contacto
        </Link>
        {usuario && !!usuario.admin && (
          <IconButton className={classes.rightButton} to="/admin" component={RouterLink}>
            <SupervisorAccount color="primary" />
          </IconButton>
        )}
      </div>
    </div>
  );
}
