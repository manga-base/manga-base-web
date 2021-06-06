import { BrowserRouter as Router, Switch } from "react-router-dom";
import ScrollToTop from "./helpers/ScrollToTop";
import { useUser } from "./context/UserContext";
import { Header, Footer, Loading, PrivateRoute, PublicRoute } from "./components";
import { Home, Login, SignUp, Profile, Settings, Biblioteca, Manga, MisMangas, Contact, Admin } from "./pages";
import useGlobalStyle from "./style";

export default function App() {
  const classes = useGlobalStyle();
  const { usuarioCargado } = useUser();

  if (!usuarioCargado) return <Loading />;

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className={classes.mainApp}>
        <Switch>
          <PublicRoute exact path={["/", "/home"]} component={Home} />
          <PublicRoute exact path="/biblioteca" component={Biblioteca} />
          <PublicRoute exact path="/manga/:id" component={Manga} />
          <PublicRoute exact path="/contact" component={Contact} />
          <PublicRoute exact path="/login" component={Login} restricted />
          <PublicRoute exact path="/signup" component={SignUp} restricted />
          <PublicRoute exact path="/profile/:id/:tab?" component={Profile} />
          <PrivateRoute exact path="/settings" component={Settings} />
          <PrivateRoute exact path="/mis-mangas/:tab?" component={MisMangas} />
          <PrivateRoute exact path="/admin" component={Admin} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}
