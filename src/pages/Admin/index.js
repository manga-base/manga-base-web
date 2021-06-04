import { Button, Typography } from "@material-ui/core";
import { Loading, Message } from "../../components";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const Admin = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [mensajes, setMensajes] = useState([]);
  const [mensajesCargados, setMensajesCargados] = useState(false);

  useEffect(() => {
    if (!usuario || !usuario.admin) {
      history.push("/");
      return;
    }

    const getMensajes = async () => {
      try {
        const { data } = await http.get(`/private-contacto/`);
        if (data.correcta) {
          setMensajes(data.datos);
        } else {
          enqueueSnackbar(data.mensaje, {
            variant: "error",
          });
        }
        setMensajesCargados(true);
      } catch (error) {
        enqueueSnackbar("Error al cargar los mensajes", {
          variant: "error",
        });
        setMensajesCargados(true);
      }
    };
    getMensajes();
  }, [enqueueSnackbar, history, usuario]);

  if (!mensajesCargados) return <Loading />;

  return (
    <div className={classes.mainContainer}>
      <Typography variant="h1">Admin</Typography>
      {mensajes.map((props, i) => (
        <Message key={i.toString()} {...props} />
      ))}
    </div>
  );
};

export default Admin;
