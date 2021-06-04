import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect, useMemo, useContext } from "react";
import { http } from "../helpers/http";
import { deleteToken, getToken, setToken } from "../helpers/storage/token";

const UserContext = React.createContext();

export const UserProvider = (props) => {
  const [usuario, setUsuario] = useState(null);
  const [usuarioCargado, setUsuarioCargado] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const cargarUsuario = async () => {
      if (!getToken()) {
        setUsuarioCargado(true);
        return;
      }

      try {
        const { data: usuario } = await http.get("/whoami"); //, { cancelToken: source.token }
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
    try {
      const { data } = await http.post("/login", { email, password });
      console.log("Login: ", data);
      if (data.correcta) {
        setUsuario(data.datos.usuario);
        setToken(data.datos.token);
      } else {
        return data.mensaje;
      }
    } catch (error) {
      enqueueSnackbar("Error en el login", {
        variant: "error",
      });
    }
  };

  const update = async (body) => {
    try {
      const { data } = await http.put(`/usuario/`, body);
      if (data.correcta) {
        setUsuario(data.datos.usuario);
        setToken(data.datos.token);
      } else {
        return data.mensaje;
      }
    } catch (error) {
      enqueueSnackbar("Error al editar la información del perfil", {
        variant: "error",
      });
    }
  };

  const signup = async (usuario) => {
    try {
      const { data } = await http.post("/signup/", usuario);
      if (data.correcta) {
        setUsuario(data.usuario);
        setToken(data.token);
      } else {
        return data.mensaje;
      }
    } catch (error) {
      enqueueSnackbar("Error al registrarse.", {
        variant: "error",
      });
    }
  };

  const logout = () => {
    setUsuario(null);
    deleteToken();
  };

  const value = useMemo(() => {
    return {
      usuario,
      usuarioCargado,
      login,
      update,
      logout,
      signup,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, usuarioCargado]);

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe estar dentro del proveedor UserContext");
  return context;
};
