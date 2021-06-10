import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, Container, Paper, Typography } from "@material-ui/core";
import { Forum, LibraryBooks, Public } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MangaCardContainer } from "../../components";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";

const imgUrl = process.env["REACT_APP_IMG_URL"];

const Home = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();

  const [mangasRecomendados, setMangasRecomendados] = useState([]);
  const [usuariosDestacados, setUsuariosDestacados] = useState([]);

  useEffect(() => {
    const getMangasRecomendados = async () => {
      try {
        const { data } = await http.get(`/manga/recomendados`);
        if (data.correcta) {
          setMangasRecomendados(data.datos);
        }
      } catch (error) {
        enqueueSnackbar("Error al cargar los mangas recomendados.", {
          variant: "error",
        });
      }
    };

    const getUsuariosDestacados = async () => {
      try {
        const { data } = await http.get(`/public-usuario/destacados`);
        if (data.correcta) {
          setUsuariosDestacados(data.datos);
        }
      } catch (error) {
        enqueueSnackbar("Error al cargar los mangas recomendados.", {
          variant: "error",
        });
      }
    };

    getMangasRecomendados();
    getUsuariosDestacados();
  }, [enqueueSnackbar]);

  return (
    <Container>
      <Paper className={classes.paperHome}>
        <Typography variant="h2">Manga Base</Typography>
        <Typography variant="h4" className={classes.paddingTop}>
          Almacena y administra tu colección de manga personal.
        </Typography>
        <div className={classes.cardGrid}>
          <Card className={classes.card}>
            <CardContent>
              <Public color="secondary" className={classes.largerIcon} />
              <Typography variant="h5">Descubre el mundo del manga</Typography>
              <Typography variant="body2" component="p" className={classes.bodyText}>
                Manga en realidad no es más que la palabra japonesa para “historieta”. Pero debido a que cuenta con un buen número de peculiaridades propias, el mismo término se aplica en occidente a todo el cómic japonés, así como a su particular estilo narrativo y de dibujo.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" href="https://g.co/kgs/JBFbcd" target="_blank">
                Aprende más
              </Button>
            </CardActions>
          </Card>

          <Card className={classes.card1}>
            <CardContent>
              <LibraryBooks color="secondary" className={classes.largerIcon} />
              <Typography variant="h5">Crea tu propia biblioteca</Typography>
              <Typography variant="body2" component="p" className={classes.bodyText}>
                Añade mangas a tu propia biblioteca para estar al día. Organiza y realiza un seguimiento de los mangas que ya has completado, tu progreso actual, lo que planeas leer y mucho más.
              </Typography>
            </CardContent>
          </Card>

          <Card className={classes.card1}>
            <CardContent>
              <Forum color="secondary" className={classes.largerIcon} />
              <Typography variant="h5">¡Unete a la comunidad!</Typography>
              <Typography variant="body2" component="p" className={classes.bodyText}>
                Entra a explorar nuestra biblioteca. Allí podrás encontrar mucha variedad de mangas, busca y descubre tus mangas favoritos.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" color="primary" component={RouterLink} to="/biblioteca">
                Visitar
              </Button>
            </CardActions>
          </Card>
        </div>
      </Paper>
      <Paper className={classes.paperHome}>
        <Typography variant="h4" className={classes.paddingBottom}>
          Manga Base te recomienda
        </Typography>
        <MangaCardContainer mangas={mangasRecomendados} />
      </Paper>
      <Paper className={classes.paperHome}>
        <Typography variant="h4" className={classes.paddingBottom}>
          Usuarios Destacados
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
          {usuariosDestacados
            ? usuariosDestacados.map((usuario) => {
                return (
                  <Card key={usuario.idUsuario.toString()} style={{ boxShadow: "none" }}>
                    <CardActionArea component={RouterLink} to={`/profile/${usuario.idUsuario}`} style={{ borderRadius: "50%" }}>
                      <Avatar src={imgUrl + "/avatars/" + usuario.avatar} alt={usuario.username + "'s Avatar."} className={classes.largeAvatar} />
                    </CardActionArea>
                    <Typography variant="body2">{usuario.username}</Typography>
                  </Card>
                );
              })
            : null}
        </div>
      </Paper>
    </Container>
  );
};

export default Home;
