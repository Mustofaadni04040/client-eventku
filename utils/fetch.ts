import axios from "axios";
import { config } from "../configs";
import handleError from "./handleError";

export async function getData(url: string, params?: any, token?: string) {
  try {
    return await axios.get(`${config.api_host_dev}${url}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchOptions(url: string, token?: string) {
  try {
    const response = await fetch(`${config.api_host_dev}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    return json?.data?.map((item: any) => ({
      value: item._id,
      label: item.name,
      // target: { value: item._id },
    }));
  } catch (error) {
    return handleError(error);
  }
}

export async function postData(
  url: string,
  payload: any,
  formData?: any,
  token?: string
) {
  try {
    return await axios.post(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          formData === "multipart" ? "multipart/form-data" : "application/json",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function putData(url: string, payload: any, token?: string) {
  try {
    return await axios.put(`${config.api_host_dev}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteData(url: string, token?: string) {
  try {
    return await axios.delete(`${config.api_host_dev}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
