import axios from "axios";
import { clearAuth, getAuth, setAuth } from "./authStorage";
import { config } from "@/configs";

const handleError = (error: any) => {
  const originalRequest = error.config;
  if (error.response.data.msg === "jwt expired") {
    originalRequest._retry = true;
    const session = getAuth();

    return axios
      .get(
        `${config.api_host_dev}/cms/refresh-token/${session.refreshToken}/${session.email}`
      )
      .then((res) => {
        setAuth({
          ...session,
          token: res.data.data.token,
        });
        originalRequest.headers.Authorization = `Bearer ${res.data.data.token}`;

        return axios(originalRequest);
      })
      .catch((err) => {
        window.location.href = "/auth/signin";
        console.log(err);
        clearAuth();
      });
  }

  return error;
};

export default handleError;
