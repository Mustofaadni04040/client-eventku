import { postData } from "./fetch";

export const uploadImage = async (
  file: File,
  token: string,
  url: string,
  name: string
) => {
  const formData = new FormData();
  formData.append(name, file);

  return await postData(url, formData, "multipart", token);
};
