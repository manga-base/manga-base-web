import { AppBar, Tab } from "@material-ui/core";
import { Loading, Message } from "../../components";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Book, Message as MessageIcon } from "@material-ui/icons";
import NewManga from "../NewManga";

const Admin = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { tab: paramTab } = useParams();

  const [tab, setTab] = useState("mensajes");
  const [mensajes, setMensajes] = useState([]);
  const [mensajesCargados, setMensajesCargados] = useState(false);

  useEffect(() => {
    if (!usuario || !usuario.admin) {
      history.push("/");
      return;
    }

    if (paramTab && ["mensajes", "manga"].includes(paramTab)) {
      setTab(paramTab);
    } else {
      setTab("mensajes");
      history.push(`/admin/mensajes`);
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
  }, [enqueueSnackbar, history, usuario, paramTab]);

  const handleTabChange = (e, newTab) => {
    setTab(newTab);
    history.push(`/admin/${newTab}`);
  };

  if (!mensajesCargados) return <Loading />;

  return (
    <div className={classes.mainContainer}>
      <TabContext value={tab}>
        <AppBar position="static" color="default" className={classes.TabListAppBar}>
          <TabList onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary" centered>
            <Tab label="Mensajes" icon={<MessageIcon />} value="mensajes" />
            <Tab label="Manga" icon={<Book />} value="manga" />
          </TabList>
        </AppBar>
        <TabPanel value="mensajes" index={0}>
          {mensajes.map((props, i) => (
            <Message key={i.toString()} {...props} />
          ))}
        </TabPanel>
        <TabPanel value="manga" index={1}>
          <NewManga />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Admin;
