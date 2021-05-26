import { Paper } from "@material-ui/core";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const MisMangas = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };
  console.log("localClass", localClass, typeof localClass, "globalClass", globalClass, typeof globalClass);
  return (
    <Paper className={classes.mainContainer} elevation={3}>
      <div className={classes.red}>Hola</div>
    </Paper>
  );
};

export default MisMangas;
