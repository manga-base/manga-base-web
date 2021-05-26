import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    overflow: "hidden",
  },
  mangaGrid: {
    width: "100%",
    marginBottom: theme.spacing(5),
  },
  containerFoto: {
    width: "60%",
    position: "relative",
  },
  botonFavorito: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "gold",
  },
  fotoManga: {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
  },
  botonEditarInformacion: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  fechaPublicacion: {
    color: "#999",
    fontSize: "17px",
    marginLeft: 2,
  },
  mangaInfoGrid: {
    position: "relative",
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
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
