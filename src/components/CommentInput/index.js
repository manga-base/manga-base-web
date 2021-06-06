import { Avatar, Button, TextField } from "@material-ui/core";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const CommentInput = ({ onSubmit, onClose, initialValue, submitButonText, placeholder, autoFocus, response }) => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  const username = (usuario && usuario.username) || "Usuario sin cuenta";
  const avatar = (usuario && usuario.avatar) || "noAvatar.png";
  const avatarSrc = `${imgUrl}avatars/${avatar}`;

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
    <div className={classes.commentContainer}>
      <div className={classes.commentContent}>
        <Avatar src={avatarSrc} alt={username} className={response ? classes.commentInputAvatarResponse : classes.commentAvatar} />
        <div className={classes.commentBody}>
          <TextField {...{ placeholder, autoFocus }} disabled={!usuario} className={classes.input} size="small" fullWidth multiline rowsMax={4} value={textoComentario} onFocus={() => setShowButtons(true)} onChange={(e) => setTextoComentario(e.target.value)} />
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
