const tokenKey = "token";

export const setToken = (token) => {
  localStorage.setItem(tokenKey, token);
};

export const getToken = () => {
  return localStorage.getItem(tokenKey);
};

export const deleteToken = () => {
  console.warn("Borrando Token");
  alert("Borrando Token")
  localStorage.removeItem(tokenKey);
};
