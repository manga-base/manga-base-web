import { Button, Divider, FormControl, IconButton, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { ArrowDropDown, SortByAlpha, ViewHeadline, ViewList, ViewModule } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { MangaCard, ModalManga } from "..";
import { useUser } from "../../context/UserContext";
import "./style.css";

const orderItems = [
  { label: "Año de salida", fun: "x.añoDePublicacion - y.añoDePublicacion" },
  { label: "Nota", fun: "x.nota - y.nota" },
  { label: "Orden alfabético", fun: "x.tituloPreferido < y.tituloPreferido ? -1 : 1" },
  { label: "Sin ordenar", fun: "x.id - y.id" },
];

const MangaCardContainer = ({ mangas, pagination, orderButtons, defaultView }) => {
  const { usuario } = useUser();
  const [page, setPage] = useState(1);
  const [numMangasPorPagina, setNumMangasPorPagina] = useState(10);
  const [anchorOrdenarPor, setAnchorOrdenarPor] = useState(null);
  const [ordenMangas, setOrdenMangas] = useState("Sin ordenar");
  const [mangasMostrados, setMangasMostrados] = useState(mangas);
  const [view, setView] = useState(defaultView || "card");
  const [mangaModelOpen, setMangaModelOpen] = useState(false);
  const [idModalManga, setIdModalManga] = useState(null);

  useEffect(() => {
    setMangasMostrados(mangas);
    pagination && setNumMangasPorPagina(pagination);
  }, [mangas, pagination]);

  if (!mangasMostrados || mangasMostrados.length < 1) {
    return (
      <Typography variant="body2" className="noMangasText">
        No se ha encontrado ningún manga.
      </Typography>
    );
  }

  const orderBy = (order, fun) => {
    /* eslint no-eval: 0 */
    setOrdenMangas(order);
    let arrayOrdenada = mangas;
    arrayOrdenada.sort((x, y) => eval(fun));
    setMangasMostrados(arrayOrdenada);
    setAnchorOrdenarPor(null);
  };

  const openModalManga = (id) => {
    setIdModalManga(id);
    setMangaModelOpen(true);
  };

  var numPagina = 0;
  var count = 0;
  var llistaPaginada = mangasMostrados;
  if (pagination) {
    var pagina = page;
    count = Math.ceil(mangasMostrados.length / numMangasPorPagina) < 2 ? null : Math.ceil(mangasMostrados.length / numMangasPorPagina);
    if (pagina > count) pagina = 1;
    numPagina = pagina === 1 ? 0 : (pagina - 1) * numMangasPorPagina;
    llistaPaginada = mangasMostrados.slice(numPagina, numPagina + numMangasPorPagina);
  }

  const listaMangas = llistaPaginada.map((manga) => <MangaCard key={manga.id} manga={manga} view={view} openModalManga={openModalManga} />);
  return (
    <section className="mangas-container">
      <ModalManga idManga={idModalManga} open={mangaModelOpen} onClose={() => setMangaModelOpen(false)} />
      <div className="top-buttons">
        <IconButton color={view === "card" ? "primary" : "default"} onClick={() => setView("card")}>
          <ViewModule />
        </IconButton>
        <IconButton color={view === "list" ? "primary" : "default"} onClick={() => setView("list")}>
          <ViewList />
        </IconButton>
        <IconButton color={view === "compact" ? "primary" : "default"} onClick={() => setView("compact")}>
          <ViewHeadline />
        </IconButton>
        {orderButtons && (
          <>
            <Divider orientation="vertical" style={{ height: 30, margin: "0 5px" }} />
            <Button aria-controls="order-menu" aria-haspopup="true" onClick={(e) => setAnchorOrdenarPor(e.currentTarget)} size="large" endIcon={<ArrowDropDown />}>
              Ordenar por: {ordenMangas}
            </Button>
            <Menu
              id="order-menu"
              anchorEl={anchorOrdenarPor}
              keepMounted
              open={Boolean(anchorOrdenarPor)}
              onClose={() => setAnchorOrdenarPor(null)}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {orderItems.map(({ label, fun }) => (
                <MenuItem key={label} selected={ordenMangas === label} onClick={() => orderBy(label, fun)}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
            <IconButton onClick={() => setMangasMostrados([...mangasMostrados].reverse())}>
              <SortByAlpha />
            </IconButton>
          </>
        )}
      </div>
      {view === "compact" ? (
        <TableContainer component={Paper}>
          <Table size="small" className="tabla-mangas">
            <TableHead>
              <TableRow>
                <TableCell>Titulo</TableCell>
                <TableCell>Nota</TableCell>
                <TableCell>Demografia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Año Publicación</TableCell>
                <TableCell>Año Finalización</TableCell>
                {usuario && <TableCell></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>{listaMangas}</TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="mangaCardContainer">{listaMangas}</div>
      )}

      {pagination && (
        <div style={{ position: "relative", width: "100%", marginBottom: "30px" }}>
          {count && (
            <Pagination
              count={count}
              page={page}
              onChange={(e, v) => {
                window.scrollTo(0, 0);
                setPage(v);
              }}
              color="primary"
              showFirstButton
              showLastButton
              className="mangas-pagination"
            />
          )}
          <FormControl style={{ position: "absolute", right: 0, top: "2em" }}>
            <Select
              value={numMangasPorPagina}
              onChange={(e) => {
                setPage(1);
                setNumMangasPorPagina(e.target.value);
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
    </section>
  );
};

export default MangaCardContainer;
