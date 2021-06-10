import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  paperManga: {
    padding: theme.spacing(5),
    overflow: "hidden",
  },
  mangaGrid: {
    width: "100%",
    marginBottom: theme.spacing(5),
  },
  containerFoto: {
    width: "60%",
    minHeight: 400,
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
    background: "transparent",
  },
  botonEditarInformacion: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  double: {
    flex: "2",
    [theme.breakpoints.down("sm")]: {
      flex: "1",
    },
  },
  fechaPublicacion: {
    width: 150,
    flex: "1",
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
  subtituloManga: {
    fontSize: 17,
    color: "#999",
  },
  subtituloFlag: {
    padding: "27px 4px 8px 0",
  },
  tituloManga: {
    fontSize: 20,
    marginBottom: 10,
  },
  formControl: {
    margin: `${theme.spacing(1)}px 0`,
    minWidth: 200,
  },
  formControlMargin: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(6.5),
    "& .MuiFilledInput-multiline": {
      padding: "27px 12px 8px",
    },
  },
  inline: {
    display: "flex",
    width: "100%",
    margin: `${theme.spacing(1)}px 0`,
    gap: theme.spacing(1),
  },
}));

export default useStyle;
