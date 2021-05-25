import { BrowserRouter as Router, Switch } from "react-router-dom";
import ScrollToTop from "./helpers/ScrollToTop";
import { useUser } from "./context/UserContext";
import { Header, Footer, Loading, PrivateRoute, PublicRoute } from "./components";
import { Home, Login, SignUp, Profile, Settings, Biblioteca, Manga } from "./pages";
import "./style.css";

export default function App() {
  const { usuarioCargado } = useUser();

  if (!usuarioCargado) return <Loading />;

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className="mainApp">
        <Switch>
          <PublicRoute exact path={["/", "/home"]} component={Home} />
          <PublicRoute exact path="/biblioteca" component={Biblioteca} />
          <PublicRoute exact path="/manga/:id" component={Manga} />
          <PublicRoute exact path="/login" component={Login} restricted />
          <PublicRoute exact path="/signup" component={SignUp} restricted />
          <PrivateRoute exact path="/profile/:id/:tab?" component={Profile} />
          <PrivateRoute exact path="/settings" component={Settings} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}
