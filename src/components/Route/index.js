import { Redirect, Route as ReactRoute } from "react-router";
import { useUser } from "../../context/UserContext";

const Route = ({ privada = false, restricted = false, ...props }) => {
  const { usuario } = useUser();
  if (privada && !usuario) return <Redirect to="/login" />;
  if (restricted && usuario) return <Redirect to="/home" />;
  return <ReactRoute {...props} />;
};

export default Route;
