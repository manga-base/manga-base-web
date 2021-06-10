import { Checkbox, Chip, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@material-ui/core";
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
import { getFiltros, setFiltros } from "../../helpers/storage/filtros";
import { Loading } from "../../components";

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const NewManga = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const [mangaImage, setMangaImage] = useState("");
  const [tituloPreferido, setTituloPreferido] = useState("");
  const [añoDePublicacion, setAñoDePublicacion] = useState(new Date());
  const [añoDeFinalizacion, setAñoDeFinalizacion] = useState(new Date());
  const [tituloJA, setTituloJA] = useState("");
  const [tituloES, setTituloES] = useState("");
  const [tituloEN, setTituloEN] = useState("");
  const [tituloRōmaji, setTituloRōmaji] = useState("");
  const [estado, setEstado] = useState("");
  const [estados, setEstados] = useState("");
  const [demografia, setDemografia] = useState("");
  const [demografias, setDemografias] = useState("");
  const [autores, setAutores] = useState([]);
  const [autoresElegidos, setAutoresElegidos] = useState(autores);
  const [revistas, setRevistas] = useState([]);
  const [revistasElegidas, setRevistasElegidas] = useState(revistas);
  const [generos, setGeneros] = useState([]);
  const [generosElegidos, setGenerosElegidos] = useState(generos);
  const [capitulos, setCapitulos] = useState(0);
  const [volumenes, setVolumenes] = useState(0);
  const [argumento, setArgumento] = useState("");
  const [filtrosCargados, setFiltrosCargados] = useState(false);

  useEffect(() => {
    const getFilters = async () => {
      var posiblesFiltros = getFiltros();
      if (posiblesFiltros) {
        const { estados: e, demografias: d, autores: a, revistas: r, generos: g } = posiblesFiltros;
        setEstados(e);
        setDemografias(d);
        setAutores(a);
        setRevistas(r);
        setGeneros(g);
      } else {
        try {
          const { data } = await http.get(`/biblioteca/filtros`);
          if (data.correcta) {
            const { estados: e, demografias: d, autores: a, revistas: r, generos: g } = data.datos;
            setEstados(e);
            setDemografias(d);
            setAutores(a);
            setRevistas(r);
            setGeneros(g);
            setFiltros(data.datos);
          }
        } catch (error) {
          enqueueSnackbar("Error al cargar los datos", {
            variant: "error",
          });
        }
      }
      setFiltrosCargados(true);
    };
    getFilters();
  }, [enqueueSnackbar, history]);

  if (!filtrosCargados) return <Loading />;

  return (
    <Paper elevation={3} className={classes.paperManga}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container direction="row" justify="center" alignItems="flex-start" className={classes.mangaGrid}>
          <Grid container justify="center" item lg={6}>
            <div
              className={classes.containerFoto}
              style={{
                borderRadius: 10,
                backgroundImage: `url("${mangaImage ? window.URL.createObjectURL(mangaImage) : ""}")`,
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
            <TextField className={classes.formControlMargin} fullWidth label="Argumento" value={argumento} onChange={(e) => setArgumento(e.target.value)} variant="filled" multiline rows={15} />
          </Grid>
          <Grid container direction="column" justify="flex-start" alignItems="flex-start" item lg={6} className={classes.mangaInfoGrid}>
            <div className={classes.inline}>
              <TextField className={classes.double} label="Titulo Preferido" value={tituloPreferido} onChange={(e) => setTituloPreferido(e.target.value)} variant="filled" />
              <DatePicker className={classes.fechaPublicacion} inputVariant="filled" openTo="year" views={["year"]} label="Año De Publicación" value={añoDePublicacion} onChange={(e) => setAñoDePublicacion(e)} />
            </div>
            <TextField
              label="Titulo Japones"
              className={classes.formControl}
              fullWidth
              variant="filled"
              value={tituloJA}
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
                  inputProps={{
                    name: "estado",
                    id: "select-estado",
                  }}
                >
                  {estados.map((estado, i) => (
                    <MenuItem key={i.toString()} value={estado}>
                      {estado}
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
              getOptionLabel={(v) => v}
              renderOption={(v, { selected }) => (
                <>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                  {v}
                </>
              )}
              renderTags={(autoresElegidos, getTagProps) => autoresElegidos.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
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
              getOptionLabel={(v) => v}
              renderOption={(v, { selected }) => (
                <>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                  {v}
                </>
              )}
              renderTags={(revistasElegidas, getTagProps) => revistasElegidas.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
              renderInput={(p) => <TextField {...p} variant="filled" label="Revistas" />}
              onChange={(e, v) => setRevistasElegidas(v)}
            />
            <FormControl className={classes.formControl} variant="filled" fullWidth>
              <InputLabel htmlFor="select-demografia">Demografia</InputLabel>
              <Select
                value={demografia}
                onChange={(e) => setDemografia(e.target.value)}
                inputProps={{
                  name: "demografia",
                  id: "select-demografia",
                }}
              >
                {demografias.map((demografia, i) => (
                  <MenuItem key={i.toString()} value={demografia}>
                    {demografia}
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
              getOptionLabel={(v) => v}
              renderOption={(v, { selected }) => (
                <>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                  {v}
                </>
              )}
              renderTags={(generosElegidos, getTagProps) => generosElegidos.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
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
    </Paper>
  );
};

export default NewManga;
