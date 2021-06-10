import { BrowserRouter as Router, Switch } from "react-router-dom";
import ScrollToTop from "./helpers/ScrollToTop";
import { useUser } from "./context/UserContext";
import { Header, Footer, Loading, Route } from "./components";
import { Home, Login, SignUp, Profile, Settings, Biblioteca, Manga, MisMangas, Contact, Admin, EmailVerification, EmailVerified, NotFound } from "./pages";
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
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/biblioteca" component={Biblioteca} />
          <Route exact path="/manga/:id" component={Manga} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/login" component={Login} restricted />
          <Route exact path="/signup" component={SignUp} restricted />
          <Route exact path="/verificar-email" component={EmailVerification} restricted />
          <Route exact path="/email-verificado" component={EmailVerified} restricted />
          <Route exact path="/profile/:id/:tab?" component={Profile} />
          <Route exact path="/settings" component={Settings} privada />
          <Route exact path="/mis-mangas/:tab?" component={MisMangas} privada />
          <Route exact path="/admin/:tab?" component={Admin} privada />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}
