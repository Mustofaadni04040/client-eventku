type AuthData = {
  token?: string;
  role?: string;
  refreshToken?: string;
  email?: string;
};

export const setAuth = (authData: AuthData) => {
  localStorage.setItem("auth", JSON.stringify(authData));
};

export const getAuth = (): AuthData => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : {};
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};
