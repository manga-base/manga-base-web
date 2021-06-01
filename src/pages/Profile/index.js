import { AppBar, Avatar, Button, Card, CardContent, CardMedia, Chip, Divider, Grid, Hidden, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Tab, Typography } from "@material-ui/core";
import { BarChart, Book, Bookmark, Cake, CalendarToday, Comment, Favorite, Grade, HourglassFull, Info, MenuBook, People, PersonAdd, Settings, Star } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useState, useEffect } from "react";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import { CommentBox, Loading, MangaCardContainer, PieChart } from "../../components";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import { getProfile, setProfile } from "../../helpers/storage/profile";
import { useSnackbar } from "notistack";
import { ResponsiveCalendar } from "@nivo/calendar";
import useStyle from "./style";
import useGlobalStyle from "../../style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const formatDate = (date, options) => new Date(date).toLocaleDateString("es-ES", options);

const Profile = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { usuario } = useUser();
  const { id, tab: paramTab } = useParams();
  const history = useHistory();
  const [infoPerfil, setInfoPerfil] = useState(null);
  const [perfilCargado, setPerfilCargado] = useState(false);
  const [tab, setTab] = useState("info");
  const [comentarios, setComentarios] = useState([]);
  const [comentariosCargados, setComentariosCargados] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [leSigues, setLeSigues] = useState(false);
  const [teSigue, setTeSigue] = useState(false);
  const [hoverFollowButton, setHoverFollowButton] = useState(false);

  const handleTabChange = (e, newTab) => {
    setTab(newTab);
    history.push(`/profile/${id}/${newTab}`);
  };

  useEffect(() => {
    if (!id) history.push("/home");

    if (paramTab && ["info", "favoritos", "stats", "social", "comentarios"].includes(paramTab)) {
      setTab(paramTab);
    } else {
      setTab("info");
      history.push(`/profile/${id}`);
    }

    const estadoUsuario = (datos) => {
      if (datos.seguidores.find((seguidor) => seguidor.id === usuario.id)) {
        setLeSigues(true);
      } else {
        setLeSigues(false);
      }
      if (datos.siguiendo.find((seguidor) => seguidor.id === usuario.id)) {
        setTeSigue(true);
      } else {
        setTeSigue(false);
      }
    };

    const cargarPerfil = async (idUsuario) => {
      try {
        const { data } = await http.get(`/usuario/${idUsuario}/profile`);
        const { datos, correcta, mensaje } = data;
        if (correcta) {
          estadoUsuario(datos);
          setInfoPerfil(datos);
          setProfile(id, datos);
        } else {
          enqueueSnackbar(mensaje, {
            variant: "error",
          });
        }
        setPerfilCargado(true);
      } catch (error) {
        history.push("/home");
        enqueueSnackbar("Error al cargar el perfil", {
          variant: "error",
        });
      }
    };

    let possibleProfile = getProfile(id);
    if (possibleProfile) {
      estadoUsuario(possibleProfile);
      setInfoPerfil(possibleProfile);
      setPerfilCargado(true);
    } else {
      cargarPerfil(id);
    }

    const cargarComentarios = async () => {
      try {
        var url = usuario ? `/comentario/usuario/${id}` : `/public-comentario/usuario/${id}`;
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
  }, [id, paramTab, history, usuario, enqueueSnackbar]);

  const newCommentToUser = async (idComentario) => {
    try {
      const { data } = await http.post(`/comentario-usuario/`, { idComentario, idUsuario: id });
      if (!data.correcta) {
        enqueueSnackbar("Error al insertar el comentrio al usuario.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al insertar el comentrio al usuario.", {
        variant: "error",
      });
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await http.post(`/seguidor/${id}`);
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
        autoHideDuration: 2000,
      });
      if (data.correcta) {
        setLeSigues(true);
      }
    } catch (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  };

  const handleUnfollow = async () => {
    try {
      const { data } = await http.delete(`/seguidor/${id}`);
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
        autoHideDuration: 2000,
      });
      if (data.correcta) {
        setLeSigues(false);
      }
    } catch (error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }
  };

  if (!perfilCargado) {
    return <Loading />;
  }

  const { favoritos, stats, comentarios: comentariosUsuario } = infoPerfil;
  const coloresEstadosManga = ["", "#388e3c", "#2196f3", "#f57f17", "#757575", "#f44336"];

  const avatarSrc = `${imgUrl}avatars/${infoPerfil.avatar}`;
  const bannerSrc = `${imgUrl}banners/${infoPerfil.banner}`;
  const birthdayDate = infoPerfil.birthdayDate ? formatDate(infoPerfil.birthdayDate, { year: "numeric", month: "long", day: "numeric" }) : false;
  const joinDate = formatDate(infoPerfil.created_at, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const LastMangaEntries = () => {
    const { lastMangaEntries } = stats;
    if (lastMangaEntries.length < 1) {
      return (
        <Typography className={classes.vacioText} variant="body2">
          Aun no hay actividad.
        </Typography>
      );
    }

    return lastMangaEntries.map((manga, i) => (
      <div key={manga.id.toString()}>
        {i !== 0 && <Divider variant="middle" />}
        <ListItem style={{ position: "relative" }}>
          <div title={manga.estado} style={{ backgroundColor: coloresEstadosManga[manga.idEstado] }} className={classes.statusList}></div>
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
                colors={["#C9DA8A", "#B7CE63", "#A5C250", "#8FB339", "#75922F"]}
                minValue="auto"
                margin={{ top: 20, right: 0, bottom: 0, left: 30 }}
                monthBorderWidth={0}
                monthBorderColor="#909090"
                monthLegendPosition="after"
                monthLegendOffset={15}
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
            <List>
              <LastMangaEntries />
            </List>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" alignItems="center"></Grid>
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
      { text: "Nota Media", icon: <Grade />, data: parseFloat(avgNota || 0).toFixed(2) },
    ];

    return (
      <>
        <List style={{ flexWrap: "wrap" }} className={classes.statsList}>
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
        <Divider className={classes.statsDivider} />
        <Grid container spacing={1} direction="column" className={classes.gridStatsChart}>
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

  const SocialTab = () => {
    const UserItem = ({ id, username, avatar, biografia }) => {
      return (
        <>
          <ListItem>
            <ListItemAvatar>
              <IconButton {...{ component: RouterLink, to: `/profile/${id}` }}>
                <Avatar src={`${imgUrl}avatars/${avatar}`} />
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography className={classes.niceLink} {...{ component: RouterLink, to: `/profile/${id}` }}>
                  {username}
                </Typography>
              }
              secondary={biografia}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      );
    };

    const UsersContainer = ({ users }) => {
      return (
        <List>
          {users.map((props) => (
            <UserItem key={props.username} {...props} />
          ))}
        </List>
      );
    };

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.titleSocial}>
            Seguidores
          </Typography>
          {infoPerfil.seguidores && infoPerfil.seguidores.length > 0 ? (
            <UsersContainer users={infoPerfil.seguidores} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No te sigue nadie (ᵟຶ︵ ᵟຶ).
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.titleSocial}>
            Siguiendo
          </Typography>
          {infoPerfil.siguiendo && infoPerfil.siguiendo.length > 0 ? (
            <UsersContainer users={infoPerfil.siguiendo} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No sigues a nadie
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  };

  const CommentsTab = () => {
    return <CommentBox {...{ comments: comentariosUsuario }} readOnly from noLine />;
  };

  return (
    <>
      <div className={classes.mainContainer}>
        <Card>
          <CardMedia className={classes.banner} image={bannerSrc} title={"Banner de " + infoPerfil.username} />
          <CardContent>
            <Avatar alt={infoPerfil.username} src={avatarSrc} className={classes.largeAvatar} />
            <Grid container direction="row" justify="flex-end" alignItems="center">
              {usuario.id === id ? (
                <IconButton {...{ component: RouterLink, to: `/settings` }} aria-label="Editar el perfil">
                  <Settings fontSize="default" />
                </IconButton>
              ) : leSigues ? (
                <Button onClick={handleUnfollow} onMouseEnter={() => setHoverFollowButton(true)} onMouseLeave={() => setHoverFollowButton(false)} variant="contained" color="primary" className={classes.siguiendoButton}>
                  {hoverFollowButton ? "Dejar de seguir" : "Siguiendo"}
                </Button>
              ) : (
                <IconButton onClick={handleFollow} aria-label="Añadir amigo">
                  <PersonAdd fontSize="default" />
                </IconButton>
              )}
            </Grid>
            <Typography gutterBottom variant="h5" component="h2">
              {infoPerfil.username}
              {usuario.id !== id && teSigue && <Chip variant="outlined" color="secondary" label="Te sigue" size="small" className={classes.teSigueChip} />}
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
            <AppBar position="static" color="default" className={classes.TabListAppBar}>
              <TabList onChange={handleTabChange} variant="fullWidth" indicatorColor="primary" textColor="primary" centered aria-label="ventanas del perfil">
                <Tab label="Información general" icon={<Info />} value="info" />
                <Tab label="Favoritos" icon={<Favorite />} value="favoritos" />
                <Tab label="Estadísticas" icon={<BarChart />} value="stats" />
                <Tab label="Social" icon={<People />} value="social" />
                <Tab label="Comentarios" icon={<Comment />} value="comentarios" />
              </TabList>
            </AppBar>
            <TabPanel value="info" index={0}>
              <InformacionGeneralTab />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="favoritos" index={1}>
              <MangaCardContainer mangas={favoritos} />
            </TabPanel>
            <TabPanel value="stats" index={2}>
              <StatsTab />
            </TabPanel>
            <TabPanel value="social" index={3}>
              <SocialTab />
            </TabPanel>
            <TabPanel className={classes.noPadding} value="comentarios" index={4}>
              <CommentsTab />
            </TabPanel>
          </Paper>
        </TabContext>

        {comentariosCargados && (
          <Paper className={classes.commentPaper}>
            <CommentBox comments={comentarios} newCommentFunction={newCommentToUser} />
          </Paper>
        )}
      </div>
    </>
  );
};

export default Profile;
