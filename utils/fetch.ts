import axios from "axios";
// import handleError from './handleError';
import { config } from "../configs";
import getFromLocalStorage from "./getToken";

export async function getData(
  url: string,
  params?: Record<string, any>,
  token?: string
) {
  try {
    return await axios.get(`${config.api_host_dev}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    // return handleError(err);
    console.log(err);
  }
}

export async function postData(url: string, payload: any, formData?: any) {
  try {
    const { token } = getFromLocalStorage("token")
      ? JSON.parse(getFromLocalStorage("token") || "{}")
      : {};

    return await axios.post(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": formData ? "multipart/form-data" : "application/json",
      },
    });
  } catch (err) {
    // return handleError(err);
    console.log(err);
  }
}

export async function putData(url: string, payload: any) {
  try {
    const { token } = getFromLocalStorage("token")
      ? JSON.parse(getFromLocalStorage("token") || "{}")
      : {};

    return await axios.put(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    // return handleError(err);
    console.log(err);
  }
}

export async function deleteData(url: string) {
  try {
    const { token } = getFromLocalStorage("token")
      ? JSON.parse(getFromLocalStorage("token") || "{}")
      : {};

    return await axios.delete(`${config.api_host_dev}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    // return handleError(err);
    console.log(err);
  }
}
