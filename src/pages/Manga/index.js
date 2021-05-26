import { Chip, Grid, IconButton, makeStyles, Paper, Tooltip, Typography, withStyles } from "@material-ui/core";
import { MoreVert, Star, StarBorder } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CommentBox, Loading, ModalManga } from "../../components";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import { getManga, setManga } from "../../helpers/storage/manga";
import useStyle from "./style";
import "./style.css";

const imgUrl = process.env["REACT_APP_IMG_URL"];

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
  const [comentarios, setComentarios] = useState([]);
  const [comentariosCargados, setComentariosCargados] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
        setMangaCargado(true);
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

    const cargarComentarios = async () => {
      try {
        const { data } = await http.get(`/comentario/manga/${id}`);
        if (data.correcta) {
          setComentarios(data.datos);
          setComentariosCargados(true);
        }
      } catch (error) {
        setComentariosCargados(true);
        enqueueSnackbar("Error al cargar los comentarios", {
          variant: "error",
        });
      }
    };

    if (usuario) {
      cargarComentarios();
    }
  }, [id]);

  const handleChipClick = (e) => {
    //console.log("Chip click", e);
  };

  const newCommentToManga = async (idComentario) => {
    try {
      const { data } = await http.post(`/comentario-manga/`, { idComentario, idManga: id, idUsuario: usuario.id });
      if (!data.correcta) {
        enqueueSnackbar("Error al insertar el comentrio al manga", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al insertar el comentrio al manga", {
        variant: "error",
      });
    }
  };

  if (!mangaCargado) return <Loading />;

  const fotoSrc = `${imgUrl}manga/${infoManga.foto}`;

  return (
    <div className="main">
      <Paper elevation={3} className={classes.paper}>
        <Grid container direction="row" justify="center" alignItems="flex-start" className={classes.mangaGrid}>
          <Grid container justify="center" item lg={6}>
            <div className={classes.containerFoto}>
              <img src={fotoSrc} alt="Imagen del Manga." className={classes.fotoManga} />
            </div>
          </Grid>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" item lg={6} className={classes.mangaInfoGrid}>
            {usuario && (
              <IconButton onClick={() => setOpenModal(true)} className={classes.botonEditarInformacion}>
                <MoreVert />
              </IconButton>
            )}
            <Grid container direction="row" alignItems="center" item>
              <h1 className="title-manga">{infoManga.tituloPreferido}</h1>
              <Typography className={classes.fechaPublicacion}>({infoManga.añoDePublicacion})</Typography>
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
            <div className={classes.chipContainer}>
              <Typography>Revista/s: </Typography>
              {infoManga.revistas.map((revista) => {
                return <Chip key={revista} label={revista} onClick={handleChipClick} />;
              })}
            </div>
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
      {comentariosCargados && <CommentBox comments={comentarios} newCommentFunction={newCommentToManga} />}
      <ModalManga idManga={id} open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Manga;
