import { Avatar, IconButton, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Collapse } from "@material-ui/core";
import { Delete, Edit, ExpandLess, ExpandMore, MoreHoriz, ThumbDown, ThumbUp } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { CommentInput } from "..";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

function timeSince(date) {
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const q = (interval, plural, singular) => `hace ${Math.floor(interval).toString()} ${interval >= 2 ? plural : singular}`;
  var interval = seconds / 31536000;
  if (interval > 1) return q(interval, "años", "año");
  interval = seconds / 2592000;
  if (interval > 1) return q(interval, "meses", "mes");
  interval = seconds / 604800;
  if (interval > 1) return q(interval, "semanas", "semana");
  interval = seconds / 86400;
  if (interval > 1) return q(interval, "días", "día");
  interval = seconds / 3600;
  if (interval > 1) return q(interval, "horas", "hora");
  interval = seconds / 60;
  if (interval > 1) return q(interval, "minutos", "minuto");
  return `hace ${Math.floor(seconds).toString()} ${seconds >= 2 ? "segundos" : "segundo"}`;
}

const Comment = ({ comment, from, noLine, isResponse, readOnly, defaultOpen }) => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { id, texto, puntosPositivos, estadoUsuario, idUsuario, username, avatar, respuestas, origen } = comment;
  const avatarSrc = `${imgUrl}avatars/${avatar}`;
  const [puntuacion, setPuntuacion] = useState(puntosPositivos);
  const [puntuacionUsuario, setPuntuacionUsuario] = useState(estadoUsuario);
  const [textoComentario, setTextoComentario] = useState(texto);
  const [anchorElComment, setAnchorElComment] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [enEdicion, setEnEdicion] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [mostrarResponder, setMostrarResponder] = useState(false);
  const [respuestasComentarios, setrespuestasComentarios] = useState(respuestas || []);
  const [showResponses, setShowResponses] = useState(defaultOpen || false);
  const { usuario } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickShowResponses = () => {
    setShowResponses(!showResponses);
  };

  const handleLike = () => {
    if (puntuacionUsuario === null || puntuacionUsuario.tipo === "negativo") {
      setPuntuacion(puntuacion + 1);
      actualizarPuntuacion("positivo");
    } else if (puntuacionUsuario.tipo === "positivo") {
      setPuntuacion(puntuacion - 1);
      eliminarPuntuacion();
    }
  };

  const handleDislike = () => {
    if (puntuacionUsuario === null) {
      actualizarPuntuacion("negativo");
    } else if (puntuacionUsuario.tipo === "positivo") {
      setPuntuacion(puntuacion - 1);
      actualizarPuntuacion("negativo");
    } else if (puntuacionUsuario.tipo === "negativo") {
      eliminarPuntuacion();
    }
  };

  const actualizarPuntuacion = async (tipo) => {
    const response = await http.post("/puntuacion-comentario/", { idComentario: id, tipo });
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setPuntuacionUsuario(data.datos);
    }
  };

  const eliminarPuntuacion = async () => {
    const response = await http.delete(`/puntuacion-comentario/${id}`);
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setPuntuacionUsuario(data.datos);
    }
  };

  const editarComentario = async (texto) => {
    const response = await http.put(`/comentario/${id}`, { texto });
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setTextoComentario(data.datos.texto);
    }
  };

  const eliminarComentario = async () => {
    handleDeleteDialogClose();
    const response = await http.delete(`/comentario/${id}`);
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setDeleted(true);
    }
  };

  const responderComentario = async (texto) => {
    const response = await http.post(`/comentario/`, { texto, idPadre: id });
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setrespuestasComentarios((p) => [data.datos, ...p]);
    }
  };

  const handleClickComment = (event) => {
    setAnchorElComment(event.currentTarget);
  };

  const handleCloseComment = () => {
    setAnchorElComment(null);
  };

  const handleEditarComentario = () => {
    handleCloseComment();
    setEnEdicion(true);
  };

  const handleEliminarComentario = () => {
    handleCloseComment();
    setOpenDeleteDialog(true);
  };

  const exitEdicion = () => {
    setEnEdicion(false);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const From = () => {
    var src = origen.from === "usuario" ? `${imgUrl}avatars/${origen.avatar}` : `${imgUrl}manga/${origen.foto}`;
    var label = origen.from === "usuario" ? origen.username : origen.tituloPreferido;
    var to = origen.from === "usuario" ? `/profile/${origen.idUsuario}` : `/manga/${origen.idManga}`;
    return (
      <div className={classes.commentFrom}>
        <Avatar {...{ src, alt: label }} className={classes.smallAvatar} />
        <Typography variant="caption" color="textSecondary">
          {origen.from === "usuario" ? "Perfil:" : "Manga:"} &nbsp;
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" className={classes.niceLink} {...{ component: RouterLink, to }}>
          {label}
        </Typography>
      </div>
    );
  };

  if (deleted) return null;

  if (enEdicion) {
    return <CommentInput onSubmit={editarComentario} onClose={exitEdicion} initialValue={texto} submitButonText="Guardar" autoFocus={true} />;
  }

  return (
    <>
      <div className={classes.commentContainer} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {!noLine && <div className={classes.commentLine} onClick={handleClickShowResponses}></div>}
        {from && origen && <From />}
        <div className={classes.commentContent}>
          <IconButton {...{ component: RouterLink, to: `/profile/${idUsuario}` }} className={classes.commentAvatar}>
            <Avatar src={avatarSrc} alt={username} className={isResponse && classes.commentAvatarResponse} />
          </IconButton>
          <Typography variant="h2" className={classes.commentHeader}>
            <Typography {...{ component: RouterLink, to: `/profile/${idUsuario}` }} className={classes.commentUsername}>
              {username}
            </Typography>
            <Typography component="time" color="textSecondary" className={classes.commentTime}>
              {timeSince(comment["created_at"])}
              {comment["created_at"] !== comment["updated_at"] && <span> · editado {timeSince(comment["updated_at"])}</span>}
            </Typography>
          </Typography>
          <div className={classes.commentBody}>{textoComentario}</div>
          <div className={classes.flex}>
            <IconButton className={classes.thumbButton} disabled={!usuario} color={puntuacionUsuario && puntuacionUsuario.tipo === "positivo" ? "primary" : "inherit"} onClick={handleLike}>
              <ThumbUp className={classes.thumbIcon} />
            </IconButton>
            <Typography className={classes.commentDate} color="textSecondary">
              {puntuacion || null}
            </Typography>
            <IconButton className={classes.thumbButton} disabled={!usuario} color={puntuacionUsuario && puntuacionUsuario.tipo === "negativo" ? "primary" : "inherit"} onClick={handleDislike}>
              <ThumbDown className={classes.thumbIcon} />
            </IconButton>
            {!readOnly && (
              <Button size="small" disabled={!usuario} onClick={() => setMostrarResponder(true)}>
                Responder
              </Button>
            )}
            {usuario && usuario.id === idUsuario && (
              <div hidden={!hovered}>
                <IconButton size="small" aria-controls="comment-menu" aria-haspopup="true" onClick={handleClickComment}>
                  <MoreHoriz />
                </IconButton>
                {/* Menu */}
                <Menu
                  id="comment-menu"
                  anchorEl={anchorElComment}
                  keepMounted
                  open={Boolean(anchorElComment)}
                  onClose={handleCloseComment}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleEditarComentario}>
                    <Edit className={classes.popupIcon} /> Editar
                  </MenuItem>
                  <MenuItem onClick={handleEliminarComentario}>
                    <Delete className={classes.popupIcon} /> Eliminar
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
          {mostrarResponder && <CommentInput response onSubmit={responderComentario} onClose={() => setMostrarResponder(false)} submitButonText="Responder" autoFocus={true} />}
          {respuestasComentarios.length !== 0 && (
            <>
              <Button color="primary" onClick={handleClickShowResponses}>
                {showResponses ? (
                  <>
                    Ocultar Respuestas
                    <ExpandLess />
                  </>
                ) : (
                  <>
                    Ver Respuestas
                    <ExpandMore />
                  </>
                )}
              </Button>
              <Collapse in={showResponses}>
                {respuestasComentarios.map((respuesta) => (
                  <Comment key={respuesta.id.toString()} {...{ comment: respuesta, noLine }} isResponse />
                ))}
              </Collapse>
            </>
          )}
        </div>
      </div>
      {/* Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose} aria-labelledby="dialog-delete-title" aria-describedby="dialog-delete-description">
        <DialogTitle id="dialog-delete-title">{"Eliminar comentario"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-delete-description">¿Quieres eliminar tu comentario definitivamente?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancelar</Button>
          <Button onClick={eliminarComentario} color="primary" variant="contained" className={classes.redButton} autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
