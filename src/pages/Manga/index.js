import { Chip, Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Delete, Edit, MoreVert } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CommentBox, Loading, ModalManga, NewManga } from "../../components";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const Manga = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { usuario } = useUser();

  const [infoManga, setInfoManga] = useState(null);
  const [mangaCargado, setMangaCargado] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [comentariosCargados, setComentariosCargados] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (!id) history.push("/home");
    const cargarManga = async () => {
      try {
        const { data } = await http.get(`/manga/info/${id}`);
        if (data.correcta) {
          setInfoManga(data.datos);
        }
      } catch (error) {
        history.push("/home");
        enqueueSnackbar("Error al cargar el manga", {
          variant: "error",
        });
      }
      setMangaCargado(true);
    };

    cargarManga();

    const cargarComentarios = async () => {
      try {
        var url = usuario ? `/comentario/manga/${id}` : `/public-comentario/manga/${id}`;
        const { data } = await http.get(url);
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

    cargarComentarios();
  }, [id, usuario, history, enqueueSnackbar]);

  const Subtitle = (props) => {
    if (!props.titulo) return null;
    return (
      <h2 className={classes.subtituloManga}>
        {props.flag && <img className={classes.subtituloFlag} alt={props.flag + "-flag"} src={"https://www.countryflags.io/" + props.flag + "/shiny/24.png"} />}
        {props.titulo}
      </h2>
    );
  };

  const handleChipClick = (tipo, nombre) => {
    history.push(`/biblioteca?${tipo}%5B%5D=${encodeURI(nombre)}`);
  };

  const newCommentToManga = async (idComentario) => {
    try {
      const { data } = await http.post(`/comentario-manga/`, { idComentario, idManga: id });
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

  const handleDeleteManga = async () => {
    try {
      const { data } = await http.delete(`/private-manga/${id}`);
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
      });
      if (data.correcta) {
        history.push("/");
      }
    } catch (error) {
      enqueueSnackbar("Error al insertar el comentrio al manga", {
        variant: "error",
      });
    }
  };
  if (!mangaCargado) return <Loading />;

  if (modoEdicion)
    return (
      <div className={classes.mainContainer}>
        <NewManga defaultManga={infoManga} onClose={() => setModoEdicion(false)} />
      </div>
    );

  const fotoSrc = `${imgUrl}manga/${infoManga.foto}`;

  return (
    <div className={classes.mainContainer}>
      <Paper elevation={3} className={classes.paperManga}>
        <Grid container direction="row" justify="center" alignItems="flex-start" className={classes.mangaGrid}>
          <Grid container justify="center" item lg={6}>
            <div className={classes.containerFoto}>
              <img src={fotoSrc} alt="Imagen del Manga." className={classes.fotoManga} />
            </div>
          </Grid>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" item lg={6} className={classes.mangaInfoGrid}>
            <div className={classes.absoluteButtons}>
              {usuario && (
                <IconButton onClick={() => setOpenModal(true)}>
                  <MoreVert />
                </IconButton>
              )}
              {usuario && !!usuario.admin && (
                <>
                  <IconButton onClick={() => setModoEdicion(true)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteManga()}>
                    <Delete />
                  </IconButton>
                </>
              )}
            </div>
            <Grid container direction="row" alignItems="baseline" item>
              <h1 className={classes.tituloManga}>{infoManga.tituloPreferido}</h1>
              <Typography className={classes.fechaPublicacion}>({infoManga.añoDePublicacion})</Typography>
            </Grid>
            <div className={classes.mangaRating}>
              <span className={classes.mangaRatingNumber}>{infoManga.nota}</span>
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
              {infoManga.autores ? (
                infoManga.autores.map(({ idAutor, nombre }) => {
                  return <Chip key={"autor" + idAutor.toString()} label={nombre} onClick={(e) => handleChipClick("Autores", nombre)} />;
                })
              ) : (
                <Typography variant="caption">No tiene ningun autor asignado</Typography>
              )}
            </div>
            <div className={classes.chipContainer}>
              <Typography>Revista/s: </Typography>
              {infoManga.revistas ? (
                infoManga.revistas.map(({ idRevista, nombre }) => {
                  return <Chip key={"revista" + idRevista.toString()} label={nombre} onClick={(e) => handleChipClick("Revistas", nombre)} />;
                })
              ) : (
                <Typography variant="caption">No tiene ninguna revista asignada</Typography>
              )}
            </div>
            <div className={classes.chipContainer}>
              <Typography>Demografia: </Typography>
              <Chip key={infoManga.id} label={infoManga.demografia} onClick={(e) => handleChipClick("Demografia", infoManga.demografia)} />
            </div>
            <div className={classes.chipContainer}>
              <Typography>Géneros:</Typography>
              {infoManga.generos ? (
                infoManga.generos.map(({ idGenero, genero }) => {
                  return <Chip key={"genero" + idGenero.toString()} label={genero} onClick={(e) => handleChipClick("Géneros", genero)} />;
                })
              ) : (
                <Typography variant="caption">No tiene ningun genero asignado</Typography>
              )}
            </div>
            <div className={classes.chipContainer}>
              <Typography>Capitulos: </Typography>
              <Chip label={infoManga.capitulos || "?"} />
            </div>
            <div className={classes.chipContainer}>
              <Typography>Volumenes: </Typography>
              <Chip label={infoManga.volumenes} />
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
