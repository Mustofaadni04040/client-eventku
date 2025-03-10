// get token for server side
const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem("token");
};

export default getFromLocalStorage;
