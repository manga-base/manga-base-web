import { Avatar, Button, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  butonContainer: {
    display: "flex",
    marginTop: 5,
    justifyContent: "flex-end",
    "& > *": {
      marginRight: theme.spacing(1),
    },
    "& > *:last-child": {
      marginRight: 0,
    },
  },
  input: {
    "& .MuiInputBase-root": {
      fontSize: 14,
    },
    "& .MuiInputBase-multiline": {
      padding: "6px 0 4px",
    },
  },
}));

const imgUrl = process.env["REACT_APP_IMG_URL"];

const CommentInput = ({ onSubmit, onClose, initialValue, submitButonText, placeholder, autoFocus, response }) => {
  const { usuario } = useUser();
  const { username, avatar } = usuario;
  const avatarSrc = `${imgUrl}avatars/${avatar}`;

  const classes = useStyles();
  const [textoComentario, setTextoComentario] = useState(initialValue || "");
  const [showButtons, setShowButtons] = useState(false);

  const close = () => {
    setShowButtons(false);
    onClose && onClose();
  };

  const submit = () => {
    setShowButtons(false);
    onSubmit(textoComentario);
    setTextoComentario("");
    onClose && onClose();
  };

  return (
    <div className="comment-container">
      <div className="comment-content">
        <Avatar src={avatarSrc} alt={username} className={`comment-avatar ${response && "response"}`} />
        <div className="comment-body">
          <TextField {...{ placeholder, autoFocus }} className={classes.input} size="small" fullWidth multiline rowsMax={4} value={textoComentario} onFocus={() => setShowButtons(true)} onChange={(e) => setTextoComentario(e.target.value)} />
        </div>
      </div>
      {showButtons && (
        <div className={classes.butonContainer}>
          <Button variant="text" onClick={close}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={submit}>
            {submitButonText || "Enviar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
