import axios from "axios";
import React, { useState, useEffect, useMemo, useContext } from "react";
import { http } from "../helpers/http";
import { deleteToken, getToken, setToken } from "../helpers/storage/token";

const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioCargado, setUsuarioCargado] = useState(false);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const cargarUsuario = async () => {
      if (!getToken()) {
        setUsuarioCargado(true);
        return;
      }

      try {
        const { data: usuario } = await http.get("/whoami", { cancelToken: source.token });
        setUsuario(usuario);
        setUsuarioCargado(true);
      } catch (error) {
        logout();
        setUsuarioCargado(true);
      }
    };

    cargarUsuario();
    return () => {
      source.cancel();
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await http.post("/login", { email, password });
    if (data.correcta) {
      setUsuario(data.datos.usuario);
      setToken(data.datos.token);
    } else {
      return data.mensaje;
    }
  };

  const signup = async (usuario) => {
    const { data } = await http.post("/signup", usuario);
    if (data.error) return data.error;
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const logout = (p) => {
    console.warn("Logout", p);
    setUsuario(null);
    deleteToken();
  };

  const value = useMemo(() => {
    return {
      usuario,
      usuarioCargado,
      login,
      logout,
      signup,
    };
  }, [usuario, usuarioCargado]);

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe estar dentro del proveedor UserContext");
  return context;
};
