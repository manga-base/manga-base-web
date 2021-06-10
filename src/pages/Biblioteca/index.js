import { Button, Checkbox, InputAdornment, Slider, TextField, Typography } from "@material-ui/core";
import { Book, CheckBox, CheckBoxOutlineBlank, Search, Share } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Loading, MangaCardContainer } from "../../components";
import { http } from "../../helpers/http";
import { setStorageMangas, getAllMangas } from "../../helpers/storage/manga";
import { setFiltros, getFiltros } from "../../helpers/storage/filtros";
import useGlobalStyle from "../../style";
import useStyle from "./style";

var dummy = document.createElement("input");

const Biblioteca = () => {
  const localClass = useStyle();
  const globalClass = useGlobalStyle();
  const classes = { ...localClass, ...globalClass };

  const { enqueueSnackbar } = useSnackbar();

  const [datosCargados, setDatosCargados] = useState(false);
  const [mangas, setMangas] = useState([]);
  const [mangasCargados, setMangasCargados] = useState(false);
  const [mangasMostrados, setMangasMostrados] = useState(mangas);

  const history = useHistory();

  const [valorDeBusqueda, setValorDeBusqueda] = useState("");
  const [estados, setEstados] = useState([]);
  const [estadosElegidos, setEstadosElegidos] = useState(estados);
  const [demografias, setDemografias] = useState([]);
  const [demografiasElegidas, setDemografiasElegidas] = useState(demografias);
  const [autores, setAutores] = useState([]);
  const [autoresElegidos, setAutoresElegidos] = useState(autores);
  const [revistas, setRevistas] = useState([]);
  const [revistasElegidas, setRevistasElegidas] = useState(revistas);
  const [generos, setGeneros] = useState([]);
  const [generosElegidos, setGenerosElegidos] = useState(generos);
  const [nota, setNota] = useState([1, 5]);

  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;

  const arrayFiltros = [
    { label: "Estados", values: estados, setFunction: setEstadosElegidos, value: estadosElegidos },
    { label: "Demografia", values: demografias, setFunction: setDemografiasElegidas, value: demografiasElegidas },
    { label: "Autores", values: autores, setFunction: setAutoresElegidos, value: autoresElegidos },
    { label: "Revistas", values: revistas, setFunction: setRevistasElegidas, value: revistasElegidas },
    { label: "Géneros", values: generos, setFunction: setGenerosElegidos, value: generosElegidos },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getMangas = async () => {
      var posiblesMangas = getAllMangas();
      if (posiblesMangas.length > 10) {
        setMangas(posiblesMangas);
        setMangasMostrados(posiblesMangas);
        setMangasCargados(true);
      } else {
        try {
          const { data } = await http.get(`/biblioteca/mangas`);
          if (data.correcta) {
            setMangas(data.datos);
            setMangasMostrados(data.datos);
            setStorageMangas(data.datos);
          }
          setMangasCargados(true);
        } catch (error) {
          enqueueSnackbar("Error al cargar los mangas", {
            variant: "error",
          });
          setMangasCargados(true);
        }
      }
    };

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
          enqueueSnackbar("Error al cargar los filtros", {
            variant: "error",
          });
        }
      }
    };

    const init = async () => {
      await getMangas();
      await getFilters();
      let q = params.get("q");
      q && setValorDeBusqueda(q);
      arrayFiltros.forEach(({ label, setFunction }) => {
        label = `${label}[]`;
        let x = params.getAll(label);
        x && setFunction(x);
      });
      setDatosCargados(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, history]);

  useEffect(() => {
    if (!mangasCargados) return;

    var mangasFiltrados = mangas;

    const elNombreCoincide = (manga) => {
      var resultados = ["tituloPreferido", "tituloJA", "tituloRōmaji", "tituloES", "tituloEN"].map((t) => {
        if (!manga[t]) return false;
        return manga[t].toLowerCase().search(valorDeBusqueda.toLowerCase()) !== -1;
      });
      return resultados.includes(true);
    };

    const elEstadoCoincide = (manga) => estadosElegidos.length === 0 || estadosElegidos.some((estado) => estado === manga.estado);
    const laDemografiaCoincide = (manga) => demografiasElegidas.length === 0 || demografiasElegidas.some((demografia) => demografia === manga.demografia);
    const elAutorCoincide = (manga) => autoresElegidos.length === 0 || autoresElegidos.some((autorElegido) => manga.autores.some((autorManga) => autorElegido === autorManga));
    const laRevistaCoincide = (manga) => revistasElegidas.length === 0 || revistasElegidas.some((revistaElegida) => manga.revistas.some((revistaManga) => revistaElegida === revistaManga));
    const elGeneroCoincide = (manga) => generosElegidos.length === 0 || generosElegidos.some((generoElegido) => manga.generos.some((generoManga) => generoElegido === generoManga));
    const laNotaCoincide = (manga) => manga.nota >= nota[0] && manga.nota <= nota[1];

    mangasFiltrados = mangasFiltrados.filter((manga) => elNombreCoincide(manga) && elEstadoCoincide(manga) && laDemografiaCoincide(manga) && elAutorCoincide(manga) && laRevistaCoincide(manga) && elGeneroCoincide(manga) && laNotaCoincide(manga));

    setMangasMostrados(mangasFiltrados);

    const params = new URLSearchParams(window.location.search);

    if (!datosCargados) return;
    valorDeBusqueda ? (params.has("q") ? params.set("q", valorDeBusqueda) : params.append("q", valorDeBusqueda)) : params.delete("q");

    arrayFiltros.forEach(({ value, label }) => {
      label = `${label}[]`;
      if (value) {
        params.delete(label);
        value.forEach((x) => {
          params.append(label, x);
        });
      } else {
        if (params.has(label)) {
          params.delete(label);
        }
      }
    });

    history.push({ search: params.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorDeBusqueda, estadosElegidos, demografiasElegidas, autoresElegidos, autoresElegidos, revistasElegidas, generosElegidos, nota, history]);

  const cleanFilters = () => {
    setValorDeBusqueda("");
    setEstadosElegidos([]);
    setDemografiasElegidas([]);
    setAutoresElegidos([]);
    setRevistasElegidas([]);
    setGenerosElegidos([]);
    setNota([1, 10]);
  };

  const copiarUrl = () => {
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    enqueueSnackbar("¡Copiado correctamente al portapapeles!", {
      variant: "success",
      autoHideDuration: 1500,
    });
  };

  const AutocompleteModule = ({ label, values, setFunction, value }) => {
    return (
      <div className={classes.filterModule}>
        <Typography className={classes.filterTitle}>{label}</Typography>
        <div>
          <Autocomplete
            multiple
            fullWidth
            value={value || []}
            size="small"
            options={values}
            disableCloseOnSelect
            getOptionLabel={(v) => v}
            renderOption={(v, { selected }) => (
              <>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {v}
              </>
            )}
            renderInput={(p) => <TextField {...p} variant="outlined" />}
            onChange={(e, v) => setFunction(v)}
          />
        </div>
      </div>
    );
  };

  if (!datosCargados) return <Loading />;

  return (
    <div className={classes.mainContainer}>
      <div className={classes.header}>
        <div className={classes.title}>
          <Book fontSize="large" color="primary" />
          <Typography variant="h4">Biblioteca de manga</Typography>
        </div>
        <TextField
          variant="filled"
          style={{ width: 600 }}
          placeholder="Buscar Mangas"
          type="search"
          value={valorDeBusqueda}
          onChange={(e) => setValorDeBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="large" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.bibliotecaContent}>
        <div className={classes.filtersContainer}>
          <div className={[classes.filterModule, classes.flexContainer].join(" ")}>
            <Typography variant="h5">Filtros</Typography>
            {mangas.length !== mangasMostrados.length && (
              <Button size="small" onClick={cleanFilters}>
                Borrar Filtros
              </Button>
            )}
          </div>
          {arrayFiltros.map((props, i) => (
            <AutocompleteModule key={i.toString()} {...props} />
          ))}
          <div className={classes.filterModule}>
            <Typography className={classes.filterTitle} id="nota-slider">
              Nota{" "}
              <Typography color="textSecondary" variant="caption">
                ({nota[0] + "-" + nota[1]})
              </Typography>
            </Typography>
            <div>
              <Slider value={nota} min={1} max={5} step={0.01} onChange={(e, v) => setNota(v)} valueLabelDisplay="auto" aria-labelledby="nota-slider" />
            </div>
          </div>
          <div className={[classes.filterModule, classes.centerText].join(" ")}>
            <Button startIcon={<Share fontSize="small" />} variant="contained" size="small" color="primary" onClick={copiarUrl}>
              Compartir búsqueda
            </Button>
          </div>
        </div>
        <div className={classes.mangaContainer}>
          <MangaCardContainer mangas={mangasMostrados} pagination={10} orderButtons />
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;
