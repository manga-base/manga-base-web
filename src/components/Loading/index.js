import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Loading() {
  const { backdrop } = useStyles();

  return (
    <Backdrop className={backdrop} open={true}>
      <CircularProgress />
    </Backdrop>
  );
}
