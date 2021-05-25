import { AppBar, Avatar, Box, Card, CardContent, CardHeader, CardMedia, Chip, Divider, Grid, Hidden, IconButton, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Tab, Typography } from "@material-ui/core";
import { BarChart, Book, Bookmark, Cake, CalendarToday, Comment, DeleteForever, DoneAll, Favorite, FiberManualRecord, Grade, HourglassFull, Info, MenuBook, Pause, People, PersonAdd, Settings, Star, WatchLater } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CommentBox, Loading, MangaCardContainer, PieChart } from "../../components";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import { getProfile, setProfile } from "../../helpers/storage/profile";
import { useSnackbar } from "notistack";
import { ResponsiveCalendar } from "@nivo/calendar";
import "./style.css";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const formatDate = (date, options) => new Date(date).toLocaleDateString("es-ES", options);

const useStyle = makeStyles((theme) => ({
  largeAvatar: {
    position: "absolute",
    top: 240,
    width: theme.spacing(18),
    height: theme.spacing(18),
    border: "10px solid",
    borderColor: theme.palette.background.paper,
    backgroundColor: "#fff",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  box: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    marginTop: "1.75rem",
    borderRadius: 4,
  },
  backgroundTitle: {
    backgroundColor: theme.palette.primary.main,
    color: "#000",
    borderRadius: "4px 4px 0 0",
    width: "100%",
    padding: 5,
  },
  noPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatarElevation: {
    boxShadow: theme.shadows[3],
  },
  listItem: {
    width: "auto",
  },
  activityHistoryGridItem: {
    height: 250,
  },
}));

const Profile = () => {
  const { usuario } = useUser();
  const { id, tab: paramTab } = useParams();
  const history = useHistory();
  const classes = useStyle();
  const [infoPerfil, setInfoPerfil] = useState(null);
  const [perfilCargado, setPerfilCargado] = useState(false);
  const [tab, setTab] = useState("info");
  const [amigos, setAmigos] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (e, newTab) => {
    setTab(newTab);
    history.push(`/profile/${id}/${newTab}`);
  };

  useEffect(() => {
    // eslint-disable-next-line
    if (!id) history.push("/home");

    if (paramTab && ["info", "favoritos", "stats", "amigos", "comentarios"].includes(paramTab)) {
      setTab(paramTab);
    } else {
      history.push(`/profile/${id}`);
    }

    const cargarPerfil = async (idUsuario) => {
      try {
        const { data } = await http.get(`/usuario/${idUsuario}/profile`);
        setInfoPerfil(data);
        setProfile(id, data);
        setPerfilCargado(true);
      } catch (error) {
        history.push("/home");
        enqueueSnackbar("Error al cargar el perfil", {
          variant: "error",
        });
        console.error("Error al cargar el perfil: ", error);
      }
      const { data: responseData } = await http.get(`/amistades/${id}`);
      if (responseData.correcta) {
        setAmigos(responseData.datos);
      } else {
        enqueueSnackbar(responseData.mensaje, { variant: "error" });
        return;
      }
    };

    let possibleProfile = getProfile(id);
    if (possibleProfile) {
      setInfoPerfil(possibleProfile);
      setPerfilCargado(true);
    } else {
      cargarPerfil(id);
    }
  }, [id, paramTab]);

  if (!perfilCargado) {
    return <Loading />;
  }

  const { favoritos, stats, comentarios } = infoPerfil;
  const coloresEstadosManga = ["", "#388e3c", "#2196f3", "#f57f17", "#757575", "#f44336"];

  const avatarSrc = `${imgUrl}avatars/${infoPerfil.avatar}`;
  const bannerSrc = `${imgUrl}banners/${infoPerfil.banner}`;
  const birthdayDate = formatDate(infoPerfil.birthdayDate, { year: "numeric", month: "long", day: "numeric" });
  const joinDate = formatDate(infoPerfil.created_at, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const getListPorEsado = () => {
    const { porEstado } = stats;
    if (porEstado.length < 1) {
      return (
        <Typography className="vacioText" variant="body2">
          Esto esta un poco vacío...
        </Typography>
      );
    }

    return porEstado.map((estado) => (
      <ListItem key={estado.id.toString()}>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: coloresEstadosManga[estado.idEstado] }}>{["", <Book />, <DoneAll />, <WatchLater />, <Pause />, <DeleteForever />][estado.idEstado]}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={estado.estado} secondary={estado.numMangas} />
      </ListItem>
    ));
  };

  const getLastMangaEntries = () => {
    const { lastMangaEntries } = stats;
    if (lastMangaEntries.length < 1) {
      return (
        <Typography className="vacioText" variant="body2">
          Aun no hay actividad.
        </Typography>
      );
    }

    return lastMangaEntries.map((manga, i) => (
      <div key={manga.id.toString()}>
        {i !== 0 && <Divider variant="middle" />}
        <ListItem style={{ position: "relative" }}>
          <div title={manga.estado} style={{ backgroundColor: coloresEstadosManga[manga.idEstado] }} className="statusList"></div>
          <ListItemAvatar>
            <Avatar alt={manga.tituloPreferido} src={imgUrl + "/manga/" + manga.foto} />
          </ListItemAvatar>
          <ListItemText
            primary={manga.tituloPreferido}
            secondaryTypographyProps={{
              component: "div",
            }}
            secondary={
              <>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                    <Star style={{ fontSize: 12, color: "gold" }} />
                    {manga.nota}
                  </div>
                  <Typography variant="caption">{formatDate(manga.updated_at, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</Typography>
                </div>
                <Typography variant="body2">
                  Volumenes&nbsp;{manga.volumenes}/{manga.totalVolumenesManga}&nbsp;·&nbsp;Capitulos&nbsp;{manga.capitulos}/{manga.totalCapitulosManga || "?"}
                </Typography>
              </>
            }
          />
        </ListItem>
      </div>
    ));
  };

  const InformacionGeneralTab = () => {
    const { calendar } = stats;
    var d = new Date();
    return (
      <Grid container direction="row" alignItems="stretch" justify="center">
        <Hidden smDown>
          <Grid item xs={12}>
            <Typography variant="h5">Historial de actividad</Typography>
            <div className={classes.activityHistoryGridItem}>
              <ResponsiveCalendar
                data={calendar}
                from={`${d.getFullYear()}-01-01`}
                to={`${d.getFullYear()}-12-31`}
                align="top"
                emptyColor="#616161"
                colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
                minValue="auto"
                margin={{ top: 20, right: 0, bottom: 0, left: 30 }}
                monthSpacing={5}
                monthBorderWidth={0}
                monthLegendPosition="after"
                monthLegendOffset={19}
                daySpacing={5}
                dayBorderWidth={0}
                dayBorderColor="#ffffff"
                theme={{
                  textColor: "#ffffffb3",
                  fontSize: 14,
                  tooltip: {
                    container: {
                      background: "#333",
                    },
                  },
                }}
              />
            </div>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6}>
          <Grid container direction="column">
            <Typography variant="h5">Actividad Reciente</Typography>
            <List className="fullWidthList">{getLastMangaEntries()}</List>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" alignItems="center">
            <List className="fullWidthList">{getLastMangaEntries()}</List>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const StatsTab = () => {
    const { totalMangas, totalVolumenesLeidos, totalCapitulosLeidos, totalMangasPorLeer, avgNota, porEstado } = stats;
    const listItemsList = [
      { text: "Mangas en total", icon: <MenuBook />, data: totalMangas },
      { text: "Tomos Leidos", icon: <Book />, data: totalVolumenesLeidos },
      { text: "Capitulos Leidos", icon: <Bookmark />, data: totalCapitulosLeidos },
      { text: "Mangas por Leer", icon: <HourglassFull />, data: totalMangasPorLeer },
      { text: "Nota Media", icon: <Grade />, data: parseFloat(avgNota).toFixed(2) },
    ];

    return (
      <>
        <List className="statsList">
          {listItemsList.map(({ text, icon, data }) => (
            <ListItem key={text} className={classes.listItem}>
              <ListItemAvatar>
                <Avatar className={classes.avatarElevation}>{icon}</Avatar>
              </ListItemAvatar>
              <ListItemText
                secondary={text}
                primary={
                  <Typography variant="h5" color="primary">
                    {data || 0}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
        <Grid container spacing={1} direction="column" className="gridStats">
          <Grid item xs={12} style={{ width: 800, height: 500 }}>
            <Typography variant="h4">Distribución por estado</Typography>
            <PieChart data={porEstado} arrows />
          </Grid>
          <Grid item xs={6} style={{ width: "100%", height: 300 }}>
            <PieChart data={porEstado} arrows />
          </Grid>
          <Grid item xs={6} style={{ width: "100%", height: 300 }}>
            <PieChart data={porEstado} />
          </Grid>
        </Grid>
      </>
    );
  };

  const FriendsTab = () => {
    return (
      <>
        {amigos &&
          amigos.map(({ id, username, avatar }) => (
            <Card key={id.toString()}>
              <CardHeader
                avatar={<Avatar src={imgUrl + "avatars/" + avatar} />}
                // action={
                //   <IconButton aria-label="settings">
                //     <MoreVertIcon />
                //   </IconButton>
                // }
                title={username}
              />
            </Card>
          ))}
      </>
    );
  };

  const CommentsTab = () => {
    return <CommentBox {...{ comments: comentarios }} />;
  };

  return (
    <>
      <div className="main">
        <Card>
          <CardMedia className="largeBanner" image={bannerSrc} title={"Banner de " + infoPerfil.username} />
          <CardContent>
            <Avatar alt={infoPerfil.username} src={avatarSrc} className={classes.largeAvatar} />
            <Grid container direction="row" justify="flex-end" alignItems="center">
              {usuario.id === infoPerfil.id ? (
                <IconButton aria-label="Editar el perfil">
                  <Settings fontSize="default" />
                </IconButton>
              ) : (
                <IconButton aria-label="Añadir amigo">
                  <PersonAdd fontSize="default" />
                </IconButton>
              )}
            </Grid>
            <Typography gutterBottom variant="h5" component="h2">
              {infoPerfil.username}
            </Typography>
            <Chip size="small" icon={<CalendarToday fontSize="small" />} label={joinDate} className={classes.chip} title={"Se unió el " + joinDate} />
            {birthdayDate && <Chip size="small" icon={<Cake fontSize="small" />} label={birthdayDate} className={classes.chip} title="Fecha de nacimiento" />}
            <Typography variant="body2" color="textSecondary" component="pre">
              {infoPerfil.biografia}
            </Typography>
          </CardContent>
        </Card>

        <TabContext value={tab}>
          <Paper>
            <AppBar position="static" color="default" className="TabListAppBar">
              <TabList onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary" centered aria-label="ventanas del perfil">
                <Tab label="Información general" icon={<Info />} value="info" />
                <Tab label="Favoritos" icon={<Favorite />} value="favoritos" />
                <Tab label="Estadísticas" icon={<BarChart />} value="stats" />
                <Tab label="Amigos" icon={<People />} value="amigos" />
                <Tab label="Comentarios" icon={<Comment />} value="comentarios" />
              </TabList>
            </AppBar>
            <TabPanel value="info" index={0}>
              <InformacionGeneralTab />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="favoritos" index={1}>
              <MangaCardContainer mangas={favoritos} />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="stats" index={2}>
              <StatsTab />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="amigos" index={3}>
              <FriendsTab />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="comentarios" index={4}>
              <CommentsTab />
            </TabPanel>
          </Paper>
        </TabContext>

        {/* <Grid container direction="row" alignItems="stretch" justify="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Box boxShadow={1} className={classes.box}>
              <Grid container direction="column" alignItems="center">
                <Grid item container direction="column" alignItems="center" justify="center" className={classes.backgroundTitle}>
                  <BarChart fontSize="large" color="inherit" />
                  <Typography variant="h6">Estadísticas</Typography>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List>{getListPorEsado()}</List>
                  </Grid>
                  <Grid item xs={12} md={6}></Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid> */}
      </div>
    </>
  );
};

export default Profile;
