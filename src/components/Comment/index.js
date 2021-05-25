import { Avatar, IconButton, makeStyles, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Collapse } from "@material-ui/core";
import { Delete, Edit, ExpandLess, ExpandMore, MoreHoriz, ThumbDown, ThumbUp } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { CommentInput } from "..";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import "./style.css";
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

const useStyles = makeStyles((theme) => ({
  commentUsername: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: "1.8rem",
    cursor: "pointer",
  },
  commentDate: {
    fontSize: 12,
    letterSpacing: 0.3,
    lineHeight: "1.8rem",
  },
  commentText: {
    fontSize: 14,
    whiteSpace: "pre-line",
  },
  thumbButton: {
    padding: 8,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  popupIcon: {
    margin: "0 1rem 0 0.3rem",
  },
  comentContainer: {
    padding: "0 48px 0 0",
  },
}));

const Comment = ({ comment, from, line, isResponse }) => {
  // console.log("Comment:", comment);
  const { id, texto, puntosPositivos, estadoUsuario, idUsuario, username, avatar, respuestas } = comment;
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
  const [showResponses, setShowResponses] = useState(false);
  const classes = useStyles();
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
    const response = await http.post("/puntuacion-comentario/", { idComentario: id, idUsuario: usuario.id, tipo });
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
    const response = await http.delete(`/puntuacion-comentario/${id}/${usuario.id}`);
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
    const response = await http.post(`/comentario/`, { texto, idUsuario: usuario.id, idPadre: id });
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

  if (deleted) return null;

  if (enEdicion) {
    return <CommentInput onSubmit={editarComentario} onClose={exitEdicion} initialValue={texto} submitButonText="Guardar" autoFocus={true} />;
  }

  return (
    <>
      <div className="comment-container" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {line && <div className="comment-line" onClick={handleClickShowResponses}></div>}
        {from && (
          <div className="comment-from">
            <Avatar src={avatarSrc} alt={username} className="small-avatar" />
            <Typography variant="subtitle2">Usuario: </Typography>
          </div>
        )}
        <div className="comment-content">
          <IconButton {...{ component: RouterLink, to: `/profile/${idUsuario}` }} className="comment-avatar">
            <Avatar src={avatarSrc} alt={username} className={isResponse && "comment-avatar-response"} />
          </IconButton>
          <Typography variant="h2" className="comment-header">
            <Typography component="span" className="comment-username">
              {username}
            </Typography>
            <Typography component="time" color="textSecondary" className="comment-time">
              {timeSince(comment["created_at"])}
              {comment["created_at"] !== comment["updated_at"] && <span> · editado {timeSince(comment["updated_at"])}</span>}
            </Typography>
          </Typography>
          <div className="comment-body">{textoComentario}</div>
          <div className="comment-extra">
            <IconButton className={classes.thumbButton} disabled={!usuario} color={puntuacionUsuario && puntuacionUsuario.tipo === "positivo" ? "primary" : "inherit"} onClick={handleLike}>
              <ThumbUp className="thumb-icon" />
            </IconButton>
            <Typography className={classes.commentDate} color="textSecondary">
              {puntuacion || null}
            </Typography>
            <IconButton className={classes.thumbButton} disabled={!usuario} color={puntuacionUsuario && puntuacionUsuario.tipo === "negativo" ? "primary" : "inherit"} onClick={handleDislike}>
              <ThumbDown className="thumb-icon" />
            </IconButton>
            <Button size="small" onClick={() => setMostrarResponder(true)}>
              Responder
            </Button>
            {usuario && (
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
                  <Comment key={respuesta.id.toString()} {...{ comment: respuesta, line }} isResponse />
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
          <Button onClick={eliminarComentario} color="primary" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
