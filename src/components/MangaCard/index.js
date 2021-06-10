import { Chip, TableCell, TableRow, Typography, Link, IconButton } from "@material-ui/core";
import { MoreHoriz, MoreVert } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { Link as ReactLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./style.css";
const imgUrl = process.env["REACT_APP_IMG_URL"];

const MangaCard = ({ manga, view, openModalManga }) => {
  const { usuario } = useUser();

  const Imagen = <img src={imgUrl + "/manga/" + manga.foto} alt={"Portada de " + manga.tituloPreferido} />;

  switch (view) {
    case "list":
      return (
        <article className="manga-list">
          {usuario && (
            <IconButton className="manga-button" size="small" onClick={() => openModalManga(manga.id)}>
              <MoreVert fontSize="small" />
            </IconButton>
          )}
          <div>
            <div className="manga-image">
              <ReactLink to={"/manga/" + manga.id}>
                <div>{Imagen}</div>
              </ReactLink>
            </div>
            <div className="manga-content">
              <Typography variant="h6">{manga.tituloPreferido}</Typography>
              {manga.nota && (
                <div className="manga-rating">
                  <span className="number">{manga.nota}</span>
                  <Rating name="nota-manga" size="small" precision={0.5} value={parseFloat(manga.nota)} readOnly />
                </div>
              )}
              {manga.generos && (
                <div className="generos-manga">
                  {manga.generos.map((e) => (
                    <Chip key={e} label={e} size="small" />
                  ))}
                </div>
              )}
              {manga.argumento && (
                <Typography variant="body2" className="argumento-manga">
                  {manga.argumento}
                </Typography>
              )}
            </div>
          </div>
        </article>
      );

    case "compact":
      return (
        <TableRow hover>
          <TableCell component="th" scope="row">
            <Link component={ReactLink} color="inherit" to={"/manga/" + manga.id}>
              {manga.tituloPreferido}
            </Link>
          </TableCell>
          <TableCell>{manga.nota}</TableCell>
          <TableCell>{manga.demografia}</TableCell>
          <TableCell>{manga.estado}</TableCell>
          <TableCell>{manga.añoDePublicacion}</TableCell>
          <TableCell>{manga.añoDeFinalizacion || "???"}</TableCell>
          {usuario && (
            <TableCell>
              <IconButton size="small" onClick={() => openModalManga(manga.id)}>
                <MoreHoriz fontSize="small" />
              </IconButton>
            </TableCell>
          )}
        </TableRow>
      );
    case "card":
    default:
      return (
        <article className="manga-card">
          <ReactLink to={"/manga/" + manga.id} className="manga-link" />
          {Imagen}
          {usuario && (
            <IconButton className="manga-button backgrownd" size="small" onClick={() => openModalManga(manga.id)}>
              <MoreVert fontSize="small" />
            </IconButton>
          )}
          <p>{manga.tituloPreferido}</p>
        </article>
      );
  }
};

export default MangaCard;
