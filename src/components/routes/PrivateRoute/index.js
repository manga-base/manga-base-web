import { Redirect, Route } from "react-router";
import { useUser } from "../../../context/UserContext";

const PrivateRoute = ({ ...props }) => {
  const { usuario } = useUser();
  if (!usuario) return <Redirect to="/login" />;
  return <Route {...props} />;
};

export default PrivateRoute;
