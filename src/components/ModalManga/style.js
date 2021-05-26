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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    position: "relative",
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1),
    borderRadius: 4,
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
}));

export default useStyle;
