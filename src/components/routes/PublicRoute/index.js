import { Redirect, Route } from "react-router";
import { useUser } from "../../../context/UserContext";

const PublicRoute = ({ restricted, ...props }) => {
  const { usuario } = useUser();
  if (restricted && usuario) return <Redirect to="/home" />;
  return <Route {...props} />;
};

export default PublicRoute;
