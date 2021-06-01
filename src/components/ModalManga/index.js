import { Backdrop, Box, Button, Fade, FormControl, Grid, IconButton, Input, InputAdornment, MenuItem, Modal, Select, Typography } from "@material-ui/core";
import { Close, Star, StarBorder, Add } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Loading } from "..";
import { useUser } from "../../context/UserContext";
import { http } from "../../helpers/http";
import useStyle from "./style";

const coloresEstadosManga = ["transparent", "#388e3c", "#2196f3", "#f57f17", "#757575", "#f44336"];
const labelsNota = {
  0.5: "Pésimo",
  1: "Horrible",
  1.5: "Muy malo",
  2: "Malo",
  2.5: "Promedio",
  3: "Ok",
  3.5: "Bueno",
  4: "Muy bueno",
  4.5: "Magnífico",
  5: "Obra maestra",
};

const ModalManga = ({ idManga, open, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { usuario } = useUser();
  const classes = useStyle();

  const [infoUser, setInfoUser] = useState(null);
  const [infoUserCargada, setInfoUserCargada] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [estado, setEstado] = useState(null);
  const [estadosManga, setEstadosManga] = useState([]);
  const [capitulos, setCapitulos] = useState(0);
  const [capitulosLeidos, setCapitulosLeidos] = useState(0);
  const [volumenes, setVolumenes] = useState(0);
  const [volumenesLeidos, setVolumenesLeidos] = useState(0);
  const [nota, setNota] = useState(0);
  const [valorHoverNota, setValorHoverNota] = useState(0);

  useEffect(() => {
    if (!idManga || !usuario) return;
    const cargarInfo = async () => {
      try {
        const { data } = await http.get(`/manga-usuario/${idManga}/${usuario.id}`);
        if (data.correcta) {
          const { estados, capitulosManga, volumenesManga, favorito, nota, idEstado, capitulos: c, volumenes: v } = data.datos;
          setInfoUser(data.datos);
          setEstadosManga(estados);
          setCapitulos(capitulosManga);
          setVolumenes(volumenesManga);
          setFavorito(!!favorito);
          setNota(nota || 0);
          setEstado(idEstado || 0);
          setCapitulosLeidos(c || 0);
          setVolumenesLeidos(v || 0);

          setInfoUserCargada(true);
        }
      } catch (error) {
        setInfoUserCargada(true);
        enqueueSnackbar("Error ls información del usuario", {
          variant: "error",
        });
      }
    };
    cargarInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idManga, usuario]);

  const handleSubmitUserData = async () => {
    try {
      const { data } = await http.post(`/manga-usuario/`, { id: infoUser && infoUser.id, idManga, idUsuario: usuario.id, favorito: favorito ? "1" : "0", nota, idEstado: estado, volumenes: volumenesLeidos, capitulos: capitulosLeidos });
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
        autoHideDuration: 1500,
      });
      if (data.correcta) {
        onClose();
      }
    } catch (error) {
      enqueueSnackbar("Error al enviar los datos", {
        variant: "error",
      });
    }
  };

  const sumarCapitulo = () => {
    var capL = parseInt(capitulosLeidos);
    var cap = parseInt(capitulos) || 9999999;
    if (capL < cap || cap == null) setCapitulosLeidos(capL + 1);
  };

  const sumarVolumen = () => {
    var volL = parseInt(volumenesLeidos);
    var vol = parseInt(volumenes) || 9999999;
    if (volL < vol) setVolumenesLeidos(volL + 1);
  };

  if (!idManga || !usuario) return <></>;

  if (!infoUserCargada) return <Loading />;

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paperModal}>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <IconButton aria-label="Close" onClick={onClose}>
              <Close />
            </IconButton>
            <h2>Editar información manga</h2>
            <Button variant="contained" color="primary" onClick={handleSubmitUserData}>
              Guardar
            </Button>
          </Grid>

          <div>
            <Grid container spacing={2} className={classes.gridUserMangaInfo}>
              <div className={classes.favorito}>
                <Typography>Marcar como favorito</Typography>
                <IconButton aria-label="favorito" color="inherit" title="Añada este manga a tus favoritos" onClick={() => setFavorito(!favorito)} style={{ color: "gold" }}>
                  {favorito ? <Star /> : <StarBorder />}
                </IconButton>
              </div>
              <Grid item sm={12}>
                <FormControl variant="outlined" fullWidth>
                  <Select value={estado} onChange={(e) => setEstado(e.target.value)} fullWidth style={{ backgroundColor: coloresEstadosManga[estado] }}>
                    <MenuItem value={0}>
                      <em>Sin estado</em>
                    </MenuItem>
                    {estadosManga
                      ? estadosManga.map((estado) => {
                          return (
                            <MenuItem key={estado.idEstado} value={estado.idEstado} title={estado.descripcion} style={{ backgroundColor: coloresEstadosManga[estado.idEstado] }}>
                              {estado.estado}
                            </MenuItem>
                          );
                        })
                      : ""}
                  </Select>
                </FormControl>
              </Grid>
              <Grid container direction="row" justify="space-around" alignItems="center" item sm={12}>
                <div>
                  <Typography>Capitulos: </Typography>
                  <Input
                    required
                    type="number"
                    inputProps={{
                      min: "0",
                      max: capitulos === "?" ? 9999 : capitulos,
                    }}
                    value={capitulosLeidos}
                    name="capitulosLeidos"
                    onChange={(e, v) => setCapitulosLeidos(v)}
                    // onBlur={this.checkValidity}
                    endAdornment={<InputAdornment position="end">/ {capitulos}</InputAdornment>}
                    className={classes.input}
                    // error={!capitulosLeidosValid}
                  />
                  <IconButton aria-label="Añadir capitulo" color="primary" size="small" onClick={sumarCapitulo}>
                    <Add fontSize="inherit" />
                  </IconButton>
                </div>
                <div>
                  <Typography>Volumenes: </Typography>
                  <Input
                    required
                    type="number"
                    inputProps={{
                      min: "0",
                      max: volumenes,
                    }}
                    value={volumenesLeidos}
                    name="volumenesLeidos"
                    onChange={(e, v) => setVolumenesLeidos(v)}
                    //onBlur={this.checkValidity}
                    endAdornment={<InputAdornment position="end">/ {volumenes}</InputAdornment>}
                    className={classes.input}
                    // error={!volumenesLeidosValid}
                  />
                  <IconButton aria-label="Añadir capitulo" color="primary" size="small" onClick={sumarVolumen}>
                    <Add fontSize="inherit" />
                  </IconButton>
                </div>
              </Grid>
              <Grid container direction="row" justify="space-around" alignItems="center" item sm={12}>
                <div className={classes.notaUser}>
                  <Rating name="nota-user-manga" value={parseFloat(nota)} precision={0.5} onChange={(e, v) => setNota(v)} onChangeActive={(e, v) => setValorHoverNota(v)} />
                  {nota !== null && <Box ml={2}>{labelsNota[valorHoverNota !== -1 ? valorHoverNota : nota]}</Box>}
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ModalManga;
