import { Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import { useUser } from "../../context/UserContext";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const Admin = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  const history = useHistory();

  if (!usuario || !usuario.admin) {
    history.push("/");
  }

  return (
    <div className={classes.mainContainer}>
      <Typography variant="h1">Admin</Typography>
    </div>
  );
};

export default Admin;
