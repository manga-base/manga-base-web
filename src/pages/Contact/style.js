import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
  },
  contactDropzone: {
    minHeight: 170,
    maxHeight: 170,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 8,
  },
}));

export default useStyle;
