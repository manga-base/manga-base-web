import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  gridUserMangaInfo: {
    marginTop: theme.spacing(1.5),
  },
  input: {
    width: 80,
    "& > input": {
      textAlign: "right",
      "&[type=number]": {
        "-moz-appearance": "textfield",
      },
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
  },
  notaUser: {
    textAlign: "center",
    height: 60,
  },
  favorito: {
    display: "flex",
    alignItems: "center",
    padding: 8,
  },
  modalTitle: {
    position: "relative",
    paddingRight: 50,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

export default useStyle;
