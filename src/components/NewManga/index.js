import { Button, Checkbox, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@material-ui/core";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DropzoneArea } from "material-ui-dropzone";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { http } from "../../helpers/http";
import useGlobalStyle from "../../style";
import useStyle from "./style";
import { Loading } from "../../components";
import { setManga } from "../../helpers/storage/manga";

const imgUrl = process.env["REACT_APP_IMG_URL"];
const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const NewManga = ({ defaultManga = {}, onClose }) => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();
  const [mangaImage, setMangaImage] = useState("");
  const [tituloPreferido, setTituloPreferido] = useState(defaultManga.tituloPreferido || "");
  const [añoDePublicacion, setAñoDePublicacion] = useState((defaultManga.añoDePublicacion && new Date(defaultManga.añoDePublicacion, 2)) || null);
  const [añoDeFinalizacion, setAñoDeFinalizacion] = useState((defaultManga.añoDeFinalizacion && new Date(defaultManga.añoDeFinalizacion, 2)) || null);
  const [tituloJA, setTituloJA] = useState(defaultManga.tituloJA || "");
  const [tituloES, setTituloES] = useState(defaultManga.tituloES || "");
  const [tituloEN, setTituloEN] = useState(defaultManga.tituloEN || "");
  const [tituloRōmaji, setTituloRōmaji] = useState(defaultManga.tituloRōmaji || "");
  const [estado, setEstado] = useState(defaultManga.idEstado || "");
  const [estados, setEstados] = useState("");
  const [demografia, setDemografia] = useState(defaultManga.idDemografia || "");
  const [demografias, setDemografias] = useState("");
  const [autores, setAutores] = useState([]);
  const [autoresElegidos, setAutoresElegidos] = useState(defaultManga.autores || []);
  const [revistas, setRevistas] = useState([]);
  const [revistasElegidas, setRevistasElegidas] = useState(defaultManga.revistas || []);
  const [generos, setGeneros] = useState([]);
  const [generosElegidos, setGenerosElegidos] = useState(defaultManga.generos || []);
  const [capitulos, setCapitulos] = useState(defaultManga.capitulos || 0);
  const [volumenes, setVolumenes] = useState(defaultManga.volumenes || 0);
  const [argumento, setArgumento] = useState(defaultManga.argumento || "");
  const [filtrosCargados, setFiltrosCargados] = useState(false);

  useEffect(() => {
    const getFilters = async () => {
      try {
        const { data } = await http.get(`/private-manga/`);
        if (data.correcta) {
          const { estados: e, demografias: d, autores: a, revistas: r, generos: g } = data.datos;
          setEstados(e);
          setDemografias(d);
          setAutores(a);
          setRevistas(r);
          setGeneros(g);
        }
      } catch (error) {
        enqueueSnackbar("Error al cargar los datos", {
          variant: "error",
        });
      }
      setFiltrosCargados(true);
    };
    getFilters();
  }, [enqueueSnackbar, history]);

  const handleSubmitManga = async (e) => {
    e.preventDefault();
    if (!mangaImage) {
      enqueueSnackbar("Falta la foto del manga.", { variant: "error" });
      return;
    }
    const manga = new FormData();
    [
      { name: "foto", value: mangaImage },
      { name: "tituloPreferido", value: tituloPreferido },
      { name: "tituloJA", value: tituloJA },
      { name: "tituloRōmaji", value: tituloRōmaji },
      { name: "estado", value: estado },
      { name: "demografia", value: demografia },
      { name: "argumento", value: argumento },
      { name: "tituloES", value: tituloES },
      { name: "tituloEN", value: tituloEN },
      { name: "capitulos", value: capitulos },
      { name: "volumenes", value: volumenes },
      { name: "añoDePublicacion", value: añoDePublicacion && añoDePublicacion.getFullYear() },
      { name: "añoDeFinalizacion", value: añoDeFinalizacion && añoDeFinalizacion.getFullYear() },
      { name: "autores", value: autoresElegidos.map(({ idAutor }) => idAutor) },
      { name: "revistas", value: revistasElegidas.map(({ idRevista }) => idRevista) },
      { name: "generos", value: generosElegidos.map(({ idGenero }) => idGenero) },
    ].forEach(({ name, value }) => {
      if (!value) return;
      if (typeof value !== "number" && value.length < 1) return;
      if (Array.isArray(value)) {
        value.forEach((v) => {
          manga.append(`${name}[]`, v);
        });
        return;
      }
      manga.append(name, value);
    });

    try {
      const { data } = await http.post(`/private-manga/`, manga);
      enqueueSnackbar(data.mensaje, {
        variant: data.correcta ? "success" : "error",
      });
      if (data.correcta) {
        setManga(data.datos.id, data.datos);
        history.push("/biblioteca");
      }
    } catch (error) {
      enqueueSnackbar("Error al cargar los datos", {
        variant: "error",
      });
    }
  };

  if (!filtrosCargados) return <Loading />;

  var backgrowndImage = mangaImage ? window.URL.createObjectURL(mangaImage) : defaultManga.foto ? `${imgUrl}manga/${defaultManga.foto}` : "";

  return (
    <Paper elevation={3} className={classes.paperManga}>
      <form onSubmit={handleSubmitManga}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container direction="row" justify="center" alignItems="flex-start" className={classes.mangaGrid}>
            <Grid container justify="center" item lg={6}>
              <div
                className={classes.containerFoto}
                style={{
                  borderRadius: 10,
                  backgroundImage: `url("${backgrowndImage}")`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <DropzoneArea
                  onChange={(files) => setMangaImage(files[0])}
                  dropzoneClass={classes.fotoManga}
                  showPreviews={false}
                  showPreviewsInDropzone={false}
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  showAlerts={false}
                  maxFileSize={2000000}
                  onAlert={(message, variant) => enqueueSnackbar(message, { variant })}
                  dropzoneText="Imagen Manga"
                  showFileNamesInPreview={false}
                />
              </div>
              <TextField className={classes.formControlMargin} fullWidth label="Argumento" value={argumento} required onChange={(e) => setArgumento(e.target.value)} variant="filled" multiline rows={15} />
            </Grid>
            <Grid container direction="column" justify="flex-start" alignItems="flex-start" item lg={6} className={classes.mangaInfoGrid}>
              <div className={classes.inline}>
                <TextField className={classes.double} label="Titulo Preferido" value={tituloPreferido} required onChange={(e) => setTituloPreferido(e.target.value)} variant="filled" />
                <DatePicker className={classes.fechaPublicacion} inputVariant="filled" openTo="year" views={["year"]} label="Año De Publicación" value={añoDePublicacion} required onChange={(e) => setAñoDePublicacion(e)} />
              </div>
              <TextField
                label="Titulo Japones"
                className={classes.formControl}
                fullWidth
                variant="filled"
                value={tituloJA}
                required
                onChange={(e) => setTituloJA(e.target.value)}
                InputProps={{
                  startAdornment: <img className={classes.subtituloFlag} alt={"jp-flag"} src={"https://www.countryflags.io/jp/shiny/24.png"} />,
                }}
              />
              <TextField
                label="Titulo Rōmaji"
                className={classes.formControl}
                fullWidth
                variant="filled"
                value={tituloRōmaji}
                required
                onChange={(e) => setTituloRōmaji(e.target.value)}
                InputProps={{
                  startAdornment: <img className={classes.subtituloFlag} alt={"jp-flag"} src={"https://www.countryflags.io/jp/shiny/24.png"} />,
                }}
              />
              <TextField
                label="Titulo Español"
                className={classes.formControl}
                fullWidth
                variant="filled"
                value={tituloES}
                onChange={(e) => setTituloES(e.target.value)}
                InputProps={{
                  startAdornment: <img className={classes.subtituloFlag} alt={"es-flag"} src={"https://www.countryflags.io/es/shiny/24.png"} />,
                }}
              />
              <TextField
                label="Titulo Ingles"
                className={classes.formControl}
                fullWidth
                variant="filled"
                value={tituloEN}
                onChange={(e) => setTituloEN(e.target.value)}
                InputProps={{
                  startAdornment: <img className={classes.subtituloFlag} alt={"gb-flag"} src={"https://www.countryflags.io/gb/shiny/24.png"} />,
                }}
              />
              <div className={classes.inline}>
                <FormControl className={classes.double} variant="filled">
                  <InputLabel htmlFor="select-estado">Estado</InputLabel>
                  <Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                    inputProps={{
                      name: "estado",
                      id: "select-estado",
                    }}
                  >
                    {estados.map((estado, i) => (
                      <MenuItem key={i.toString()} value={estado.idEstado}>
                        {estado.estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <DatePicker className={classes.fechaPublicacion} inputVariant="filled" openTo="year" views={["year"]} label="Año De Finalizacion" value={añoDeFinalizacion} onChange={(e) => setAñoDeFinalizacion(e)} />
              </div>
              <Autocomplete
                multiple
                className={classes.formControl}
                fullWidth
                value={autoresElegidos || []}
                size="small"
                options={autores}
                disableCloseOnSelect
                getOptionLabel={(v) => v.nombre}
                getOptionSelected={(v) => v.idAutor}
                renderOption={(v, { selected }) => (
                  <>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                    {v.nombre}
                  </>
                )}
                renderTags={(autoresElegidos, getTagProps) => autoresElegidos.map((option, index) => <Chip variant="outlined" label={option.nombre} {...getTagProps({ index })} />)}
                renderInput={(p) => <TextField {...p} variant="filled" label="Autores" />}
                onChange={(e, v) => setAutoresElegidos(v)}
              />
              <Autocomplete
                multiple
                className={classes.formControl}
                fullWidth
                value={revistasElegidas || []}
                size="small"
                options={revistas}
                disableCloseOnSelect
                getOptionLabel={(v) => v.nombre}
                getOptionSelected={(v) => v.idRevista}
                renderOption={(v, { selected }) => (
                  <>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                    {v.nombre}
                  </>
                )}
                renderTags={(revistasElegidas, getTagProps) => revistasElegidas.map((option, index) => <Chip variant="outlined" label={option.nombre} {...getTagProps({ index })} />)}
                renderInput={(p) => <TextField {...p} variant="filled" label="Revistas" />}
                onChange={(e, v) => setRevistasElegidas(v)}
              />
              <FormControl className={classes.formControl} variant="filled" fullWidth>
                <InputLabel htmlFor="select-demografia">Demografia</InputLabel>
                <Select
                  value={demografia}
                  onChange={(e) => setDemografia(e.target.value)}
                  required
                  inputProps={{
                    name: "demografia",
                    id: "select-demografia",
                  }}
                >
                  {demografias.map((demografia, i) => (
                    <MenuItem key={i.toString()} value={demografia.idDemografia}>
                      {demografia.demografia}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                className={classes.formControl}
                fullWidth
                value={generosElegidos || []}
                size="small"
                options={generos}
                disableCloseOnSelect
                getOptionLabel={(v) => v.genero}
                getOptionSelected={(v) => v.idGenero}
                renderOption={(v, { selected }) => (
                  <>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                    {v.genero}
                  </>
                )}
                renderTags={(generosElegidos, getTagProps) => generosElegidos.map((option, index) => <Chip variant="outlined" label={option.genero} {...getTagProps({ index })} />)}
                renderInput={(p) => <TextField {...p} variant="filled" label="Géneros" />}
                onChange={(e, v) => setGenerosElegidos(v)}
              />
              <div className={classes.inline}>
                <TextField label="Capitulos" fullWidth type="numeric" value={capitulos} onChange={(e) => setCapitulos(e.target.value)} variant="filled" />
                <TextField label="Volumenes" fullWidth type="numeric" value={volumenes} onChange={(e) => setVolumenes(e.target.value)} variant="filled" />
              </div>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container justify="flex-end" spacing={5}>
          {defaultManga.id && (
            <Button type="reset" className={classes.redButton} onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewManga;
