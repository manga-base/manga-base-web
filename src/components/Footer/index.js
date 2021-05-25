import { Link, Typography } from "@material-ui/core";
import "./style.css";

export default function Footer() {

  return (
    <div className="footer">
      <Typography variant="caption">©2021 Manga Base.</Typography>
      &nbsp;·&nbsp;
      <Link variant="caption" color="inherit" href="mailto:bartomeupauclar@paucasesnovescifp.cat?subject=Duda%20sobre%20MangaBase">
        Contacto
      </Link>
    </div>
  );
}
