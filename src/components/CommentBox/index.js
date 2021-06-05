import { Button, List, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core";
import { Sort } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Comment, CommentInput } from "../";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";

const useStyles = makeStyles((theme) => ({
  commentBoxContainer: {
    marginLeft: 24,
    marginRight: 24,
  },
  commentBoxHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const CommentBox = ({ comments, readOnly, from, noLine, newCommentFunction }) => {
  const classes = useStyles();
  const { usuario } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const [arrayComentarios, setArrayComentarios] = useState(comments);
  const [anchorElOrdenar, setAnchorElOrdenar] = useState(null);
  const [commentsLenght, setCommentsLenght] = useState(0);

  useEffect(() => {
    const count = (array) => {
      array.forEach((e) => {
        setCommentsLenght((e) => e + 1);
        e.respuestas && count(e.respuestas);
      });
    };

    count(arrayComentarios);
  }, [arrayComentarios]);

  const enviarComentario = async (texto) => {
    const response = await http.post(`/comentario/`, { texto });
    const { data } = response;
    enqueueSnackbar(data.mensaje, {
      variant: data.correcta ? "success" : "error",
      autoHideDuration: 1500,
    });
    if (data.correcta) {
      setArrayComentarios((p) => [data.datos, ...p]);
      newCommentFunction(data.datos.id);
    }
  };

  const handleOpenOrdenar = (event) => {
    setAnchorElOrdenar(event.currentTarget);
  };

  const handleCloseOrdenar = () => {
    setAnchorElOrdenar(null);
  };

  const ordenarPorMejoresComentarios = () => {
    handleCloseOrdenar();
    var arrayAux = arrayComentarios;
    arrayAux.sort((a, b) => (b.puntosPositivos > a.puntosPositivos ? 1 : a.puntosPositivos > b.puntosPositivos ? -1 : 0));
    setArrayComentarios(arrayAux);
  };

  const ordenarPorMasRecientes = () => {
    handleCloseOrdenar();
    var arrayAux = arrayComentarios;
    arrayAux.sort((a, b) => (b.created_at > a.created_at ? 1 : a.created_at > b.created_at ? -1 : 0));
    setArrayComentarios(arrayAux);
  };

  return (
    <div className={classes.commentBoxContainer}>
      <div className={classes.commentBoxHeader}>
        <Typography>
          {commentsLenght || 0} {commentsLenght > 1 ? "comentarios" : "comentario"}
        </Typography>
        <Button variant="text" size="small" startIcon={<Sort />} aria-controls="order-menu" aria-haspopup="true" onClick={handleOpenOrdenar}>
          Ordenar Por
        </Button>
        <Menu
          id="order-menu"
          anchorEl={anchorElOrdenar}
          keepMounted
          open={Boolean(anchorElOrdenar)}
          onClose={handleCloseOrdenar}
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
          <MenuItem onClick={ordenarPorMejoresComentarios}>Mejores Comentarios</MenuItem>
          <MenuItem onClick={ordenarPorMasRecientes}>Más recientes</MenuItem>
        </Menu>
      </div>
      {!readOnly && <CommentInput onSubmit={enviarComentario} placeholder={usuario ? "Añade un comentario público..." : "Inicia sessión para poder comentar."} />}
      <List>
        {arrayComentarios.map((comment) => (
          <Comment key={comment.id.toString()} {...{ comment, readOnly, from, noLine, defaultOpen: commentsLenght < 10 }} />
        ))}
      </List>
    </div>
  );
};

export default CommentBox;
