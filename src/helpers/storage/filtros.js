const filtrosKey = "filtros";

export const setFiltros = (filtros) => {
  sessionStorage.setItem(filtrosKey, JSON.stringify(filtros));
};

export const getFiltros = () => {
  return JSON.parse(sessionStorage.getItem(filtrosKey));
};

export const deleteFiltros = () => {
  sessionStorage.removeItem(filtrosKey);
};
