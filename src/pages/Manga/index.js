import { Chip, Grid, IconButton, makeStyles, Paper, Tooltip, Typography, withStyles } from "@material-ui/core";
import { MoreVert, Star, StarBorder } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Loading } from "../../components";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import { getManga, setManga } from "../../helpers/storage/manga";
import "./style.css";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const coloresEstadosManga = ["transparent", "#388e3c", "#2196f3", "#f57f17", "#757575", "#f44336"];

const useStyle = makeStyles((theme) => ({
  mangaContainer: {
    width: "100%",
  },
  mangaGrid: {
    width: "100%",
    marginBottom: 8,
  },
  paper: {
    padding: theme.spacing(5),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  containerFoto: {
    width: "60%",
    position: "relative",
  },
  fotoManga: {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
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

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

const Subtitle = (props) => {
  if (!props.titulo) return null;
  return (
    <h2 className="subtitulo-manga">
      {props.flag && <img className="subtitle-flag" alt={props.flag + "-flag"} src={"https://www.countryflags.io/" + props.flag + "/shiny/24.png"} />}
      {props.titulo}
    </h2>
  );
};

const Manga = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { usuario } = useUser();
  const [infoManga, setInfoManga] = useState(null);
  const [mangaCargado, setMangaCargado] = useState(false);
  const history = useHistory();
  const classes = useStyle();

  useEffect(() => {
    if (!id) history.push("/home");
    const cargarManga = async () => {
      try {
        const { data } = await http.get(`/manga/${id}`);
        if (data.correcta) {
          setInfoManga(data.datos);
          setManga(id, data.datos);
          setMangaCargado(true);
        }
      } catch (error) {
        history.push("/home");
        enqueueSnackbar("Error al cargar el manga", {
          variant: "error",
        });
      }
    };

    var possibleManga = getManga(id);
    if (possibleManga) {
      setInfoManga(possibleManga);
      setMangaCargado(true);
    } else {
      cargarManga();
    }
  }, [id]);

  const handleChipClick = (e) => {
    console.log("Chip click", e);
  };

  const handleOpenModal = (e) => {
    console.log("Open modal", e);
  };

  if (!mangaCargado) return <Loading />;

  const fotoSrc = `${imgUrl}manga/${infoManga.foto}`;

  return (
    <div className="main">
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="flex-start" className={classes.mangaGrid}>
          <Grid container justify="center" item lg={6}>
            <div className={classes.containerFoto}>
              <IconButton aria-label="favorito" color="inherit" title="Añada este manga a tus favoritos" style={{ position: "absolute", top: 10, right: 10, color: "gold" }}>
                {/* {usuario ? favorito ? <Star fontSize="large" /> : <StarBorder fontSize="large" /> : null} */}
              </IconButton>
              <img src={fotoSrc} alt="Imagen del Manga." className={classes.fotoManga} />
            </div>
          </Grid>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" item lg={6} className={classes.mangaInfoGrid}>
            {usuario ? (
              <IconButton onClick={handleOpenModal} style={{ position: "absolute", top: 0, right: 0 }}>
                <MoreVert />
              </IconButton>
            ) : (
              ""
            )}
            <Grid container direction="row" alignItems="center" item>
              <h1 className="title-manga">{infoManga.tituloPreferido}</h1>
              <Typography style={{ color: "#999", fontSize: "17px", marginLeft: 2 }}>({infoManga.añoDePublicacion})</Typography>
            </Grid>
            <div className="manga-rating">
              <span className="number">{infoManga.nota}</span>
              <Rating name="nota-manga" size="small" precision={0.5} value={parseFloat(infoManga.nota)} readOnly />
            </div>
            <Subtitle titulo={infoManga.tituloJA + " (" + infoManga.tituloRōmaji + ")"} flag="jp" />
            <Subtitle titulo={infoManga.tituloES} flag="es" />
            <Subtitle titulo={infoManga.tituloEN} flag="gb" />
            <div className={classes.chipContainer}>
              <Grid item>
                <Chip style={{ backgroundColor: infoManga.añoDeFinalizacion ? "#f44336" : "#388e3c" }} label={infoManga.añoDeFinalizacion ? infoManga.estado + " " + infoManga.añoDeFinalizacion : infoManga.estado} />
              </Grid>
            </div>
            <div className={classes.chipContainer}>
              <Typography>Autor/es: </Typography>
              {infoManga.autores.map((autor) => {
                return <Chip key={autor} label={autor} onClick={handleChipClick} />;
              })}
            </div>
            {/* <div className={classes.chipContainer}>
              <Typography>Revista/s: </Typography>
              {infoManga.revistas.map((revista) => {
                return <Chip key={revista} label={revista.nombre + " - " + revista.idEditorial.nombre} onClick={handleChipClick} />;
              })}
            </div> */}
            <div className={classes.chipContainer}>
              <Typography>Demografia: </Typography>
              <Chip key={infoManga.id} label={infoManga.demografia} onClick={handleChipClick} />
            </div>
            <div className={classes.chipContainer}>
              <Typography>Géneros:</Typography>
              {infoManga.generos.map((genero) => {
                return <Chip key={genero} label={genero} onClick={handleChipClick} />;
              })}
            </div>
            <div className={classes.chipContainer}>
              <Typography>Capitulos: </Typography>
              <Chip label={infoManga.capitulos || "?"} onClick={handleChipClick} />
            </div>
            <div className={classes.chipContainer}>
              <Typography>Volumenes: </Typography>
              <Chip label={infoManga.volumenes} onClick={handleChipClick} />
            </div>
          </Grid>
        </Grid>
        <div>
          <Typography variant="h5" color="primary">
            Argumento
          </Typography>
          <Typography variant="body1">{infoManga.argumento}</Typography>
        </div>
      </Paper>

      {/* Modal */}

      {/* {usuario ? (
        <Modal
          className={classes.modal}
          open={openModal}
          onClose={this.handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={classes.paperModal}>

              <Grid container direction="row" justify="space-between" alignItems="center">
                <IconButton aria-label="Close" onClick={this.handleCloseModal}>
                  <Close />
                </IconButton>
                <h2>Editar información manga</h2>
                <Button variant="contained" color="primary" onClick={this.handleSubmitUserData}>
                  Guardar
                </Button>
              </Grid>


              <div>
                <Grid container spacing={2} className={classes.gridUserMangaInfo}>
                  <div className={classes.favorito}>
                    <Typography>Marcar como favorito</Typography>
                    <IconButton aria-label="favorito" color="inherit" title="Añada este manga a tus favoritos" onClick={this.handleFavorito} style={{ color: "gold" }}>
                      {favorito ? <Star /> : <StarBorder />}
                    </IconButton>
                  </div>
                  <Grid item sm={12}>
                    <FormControl variant="outlined" fullWidth>
                      <Select value={estadoMangaUsuario} onChange={this.handleEstadoChange} fullWidth style={{ backgroundColor: coloresEstadosManga[estadoMangaUsuario] }}>
                        <MenuItem value={0}>
                          <em>Sin estado</em>
                        </MenuItem>
                        {estadosManga
                          ? estadosManga.map((estado) => {
                              return (
                                <MenuItem key={estado.idEstado} value={estado.idEstado} title={estado.descripcion} style={{ backgroundColor: coloresEstadosManga[estado.idEstado] }}>
                                  {estado.estado}
                                </MenuItem>
                              );
                            })
                          : ""}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid container direction="row" justify="space-around" alignItems="center" item sm={12}>
                    <div>
                      <Typography>Capitulos: </Typography>
                      <Input
                        required
                        type="number"
                        inputProps={{
                          min: "0",
                          max: capitulos === "?" ? 9999 : capitulos,
                        }}
                        value={capitulosLeidos}
                        name="capitulosLeidos"
                        onChange={this.handleChange}
                        onBlur={this.checkValidity}
                        endAdornment={<InputAdornment position="end">/ {capitulos}</InputAdornment>}
                        className={classes.input}
                        error={!capitulosLeidosValid}
                      />
                      <IconButton aria-label="Añadir capitulo" color="primary" size="small" onClick={this.sumarCapitulo}>
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                    <div>
                      <Typography>Volumenes: </Typography>
                      <Input
                        required
                        type="number"
                        inputProps={{
                          min: "0",
                          max: manga.volumenes,
                        }}
                        value={volumenesLeidos}
                        name="volumenesLeidos"
                        onChange={this.handleChange}
                        onBlur={this.checkValidity}
                        endAdornment={<InputAdornment position="end">/ {manga.volumenes}</InputAdornment>}
                        className={classes.input}
                        error={!volumenesLeidosValid}
                      />
                      <IconButton aria-label="Añadir capitulo" color="primary" size="small" onClick={this.sumarVolumen}>
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid container direction="row" justify="space-around" alignItems="center" item sm={12}>
                    <div className={classes.notaUser}>
                      <Rating name="nota-user-manga" value={parseInt(notaUser)} max={10} onChange={this.handleNota} onChangeActive={this.handleHoverNota} />
                      {notaUser !== null && <Box ml={2}>{labelsNota[hoverNota !== -1 ? hoverNota : notaUser]}</Box>}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Fade>
        </Modal>
      ) : null} 
        */}
      {/* End Modal */}
    </div>
  );
};

export default Manga;
