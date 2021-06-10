import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.light,
    },
    "&:active": {
      color: theme.palette.primary.dark,
    },
  },
}));

export default useStyle;
