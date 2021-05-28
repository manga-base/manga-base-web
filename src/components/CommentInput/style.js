import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  butonContainer: {
    display: "flex",
    marginTop: 5,
    justifyContent: "flex-end",
    "& > *": {
      marginRight: theme.spacing(1),
    },
    "& > *:last-child": {
      marginRight: 0,
    },
  },
  input: {
    "& .MuiInputBase-root": {
      fontSize: 14,
    },
    "& .MuiInputBase-multiline": {
      padding: "6px 0 4px",
    },
  },
}));

export default useStyle;
