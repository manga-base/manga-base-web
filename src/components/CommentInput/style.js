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
  commentInputAvatarResponse: {
    position: "absolute",
    marginTop: "calc(4px - 0.125rem)",
    width: 30,
    height: 30,
    left: 16,
  },
}));

export default useStyle;
