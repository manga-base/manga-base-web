import { Chip, TableCell, TableRow, Typography, Link } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { Link as ReactLink } from "react-router-dom";
import "./style.css";
const imgUrl = process.env["REACT_APP_IMG_URL"];

const MangaCard = ({ manga, view }) => {
  const Imagen = <img src={imgUrl + "/manga/" + manga.foto} alt={"Portada de " + manga.tituloPreferido} />;

  switch (view) {
    case "list":
      return (
        <article className="manga-list">
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
        </TableRow>
      );
    case "card":
    default:
      return (
        <article className="manga-card">
          <ReactLink to={"/manga/" + manga.id} className="manga-link" />
          {Imagen}
          <p>{manga.tituloPreferido}</p>
        </article>
      );
  }
};

export default MangaCard;
