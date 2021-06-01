import { Tab } from "@material-ui/core";
import { Book, Bookmarks, DeleteForever, DoneAll, Favorite, Pause, WatchLater } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { MangaCardContainer } from "../../components";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const coloresEstadosManga = ["#388e3c", "#2196f3", "#f57f17", "#757575", "#f44336"];

const MisMangas = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };
  const history = useHistory();

  const { tab: paramTab } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState("todos");
  const [mangas, setMangas] = useState({
    todos: null,
    leyendo: null,
    leido: null,
    pendiente: null,
    enEspera: null,
    abandonado: null,
    favoritos: null,
  });

  const handleTabChange = (e, newTab) => {
    setTab(newTab);
    history.push(`/mis-mangas/${newTab}`);
  };

  useEffect(() => {
    if (paramTab && ["todos", "leyendo", "leidos", "pendientes", "en-espera", "abandonados", "favoritos"].includes(paramTab)) {
      setTab(paramTab);
    } else {
      history.push(`/mis-mangas`);
    }

    const getMangas = async () => {
      try {
        const { data } = await http.get(`/manga-usuario/`);
        if (data.correcta) {
          const mangas = data.datos;
          var leyendo = mangas.filter((manga) => Number(manga.idEstado) === 1);
          var leido = mangas.filter((manga) => Number(manga.idEstado) === 2);
          var pendiente = mangas.filter((manga) => Number(manga.idEstado) === 3);
          var enEspera = mangas.filter((manga) => Number(manga.idEstado) === 4);
          var abandonado = mangas.filter((manga) => Number(manga.idEstado) === 5);
          var favoritos = mangas.filter((manga) => !!manga.favorito);
          setMangas({
            todos: mangas,
            leyendo,
            leido,
            pendiente,
            enEspera,
            abandonado,
            favoritos,
          });
        }
      } catch (error) {
        enqueueSnackbar("Error al cargar los mangas", {
          variant: "error",
        });
      }
    };

    getMangas();
  }, [paramTab, history, enqueueSnackbar]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.veritcalTabs}>
        <TabContext value={tab}>
          <TabList orientation="vertical" variant="scrollable" value={tab} onChange={handleTabChange} aria-label="Vertical tabs example" className={classes.tabsLine}>
            <Tab label="Todos" icon={<Bookmarks />} value="todos" />
            <Tab label="Leyendo" icon={<Book htmlColor={coloresEstadosManga[0]} />} value="leyendo" />
            <Tab label="Leídos" icon={<DoneAll htmlColor={coloresEstadosManga[1]} />} value="leidos" />
            <Tab label="Pendientes" icon={<WatchLater htmlColor={coloresEstadosManga[2]} />} value="pendientes" />
            <Tab label="En espera" icon={<Pause htmlColor={coloresEstadosManga[3]} />} value="en-espera" />
            <Tab label="Abandonados" icon={<DeleteForever htmlColor={coloresEstadosManga[4]} />} value="abandonados" />
            <Tab label="Favoritos" icon={<Favorite color="error" />} value="favoritos" />
          </TabList>
          <TabPanel className={classes.tabPanelFullWidth} value="todos" index={0}>
            <MangaCardContainer mangas={mangas.todos} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="leyendo" index={1}>
            <MangaCardContainer mangas={mangas.leyendo} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="leidos" index={2}>
            <MangaCardContainer mangas={mangas.leido} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="pendientes" index={3}>
            <MangaCardContainer mangas={mangas.pendiente} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="en-espera" index={4}>
            <MangaCardContainer mangas={mangas.enEspera} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="abandonados" index={4}>
            <MangaCardContainer mangas={mangas.abandonado} />
          </TabPanel>
          <TabPanel className={classes.tabPanelFullWidth} value="favoritos" index={4}>
            <MangaCardContainer mangas={mangas.favoritos} />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default MisMangas;
