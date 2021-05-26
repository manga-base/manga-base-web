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
import "./style.css";

const params = new URLSearchParams(window.location.search);
var dummy = document.createElement("input");

const Biblioteca = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [datosCargados, setDatosCargados] = useState(false);
  const [mangas, setMangas] = useState([]);
  const [mangasCargados, setMangasCargados] = useState(false);
  const [mangasMostrados, setMangasMostrados] = useState(mangas);

  // History
  const history = useHistory();

  // Filtros
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
  const [nota, setNota] = useState([1, 10]);

  const icon = <CheckBoxOutlineBlank fontSize="small" />;
  const checkedIcon = <CheckBox fontSize="small" />;

  const arrayFiltros = [
    { label: "Estados", values: estados, setFunction: setEstadosElegidos, value: estadosElegidos },
    { label: "Demografia", values: demografias, setFunction: setDemografiasElegidas, value: demografiasElegidas },
    { label: "Autores", values: autores, setFunction: setAutoresElegidos, value: autoresElegidos },
    { label: "Revistas", values: revistas, setFunction: setRevistasElegidas, value: revistasElegidas },
    { label: "Géneros", values: generos, setFunction: setGenerosElegidos, value: generosElegidos },
  ];

  // Cargar al principio
  useEffect(() => {
    async function fetchData() {
      await getMangas();
      await getFilters();
      let q = params.get("q");
      q && setValorDeBusqueda(q);
      arrayFiltros.map(({ label, setFunction }) => {
        label = `${label}[]`;
        let x = params.getAll(label);
        x && setFunction(x);
      });
      setDatosCargados(true);
    }
    fetchData();
  }, []);

  // Cargar al actualizar los filtros
  useEffect(() => {
    if (!mangasCargados) return;

    filtrar();

    if (!datosCargados) return;
    valorDeBusqueda ? (params.has("q") ? params.set("q", valorDeBusqueda) : params.append("q", valorDeBusqueda)) : params.delete("q");

    arrayFiltros.map(({ value, label }) => {
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
  }, [valorDeBusqueda, estadosElegidos, demografiasElegidas, autoresElegidos, autoresElegidos, revistasElegidas, generosElegidos, nota, history]);

  const getMangas = async () => {
    var posiblesMangas = getAllMangas();
    if (posiblesMangas.length > 10) {
      setMangas(posiblesMangas);
      setMangasMostrados(posiblesMangas);
      setMangasCargados(true);
    } else {
      try {
        console.log("Obteniendo mangas");
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

  const cleanFilters = () => {
    setValorDeBusqueda("");
    setEstadosElegidos([]);
    setDemografiasElegidas([]);
    setAutoresElegidos([]);
    setRevistasElegidas([]);
    setGenerosElegidos([]);
    setNota([1, 10]);
  };

  const filtrar = () => {
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

    // console.log("A", mangasFiltrados);
    setMangasMostrados(mangasFiltrados);
    // console.log("B", mangasFiltrados);
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

  const autocompleteModule = (label, values, setFunction, value) => {
    return (
      <div className="filter-module" key={label}>
        <Typography className="filter-title">{label}</Typography>
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
    <div className="main">
      <div className="title-header">
        <div className="titulo">
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
      <div style={{ display: "flex" }}>
        <div className="filters-container">
          <div className="filter-module flex-container">
            <Typography variant="h5">Filtros</Typography>
            {mangas.length !== mangasMostrados.length && (
              <Button size="small" onClick={cleanFilters}>
                Borrar Filtros
              </Button>
            )}
          </div>
          {arrayFiltros.map(({ label, values, setFunction, value }) => autocompleteModule(label, values, setFunction, value))}
          <div className="filter-module">
            <Typography className="filter-title" id="nota-slider">
              Nota{" "}
              <Typography color="textSecondary" variant="caption">
                ({nota[0] + "-" + nota[1]})
              </Typography>
            </Typography>
            <div>
              <Slider value={nota} min={1} max={10} onChange={(e, v) => setNota(v)} valueLabelDisplay="auto" aria-labelledby="nota-slider" />
            </div>
          </div>
          <div className="filter-module share-button">
            <Button startIcon={<Share />} variant="contained" color="primary" onClick={copiarUrl}>
              Compartir busqueda
            </Button>
          </div>
        </div>
        <div className="main-container">
          <MangaCardContainer mangas={mangasMostrados} pagination={10} orderButtons />
        </div>
      </div>
    </div>
  );
};

export default Biblioteca;
