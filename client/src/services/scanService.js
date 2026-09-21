import api from "./api";

export const classifyWasteImage = async (
  imageFile
) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  const response = await api.post(
    "/ai/classify",
    formData
  );

  return response.data;
};

export const getScans = async (
  params = {}
) => {
  const response = await api.get(
    "/scans",
    {
      params,
    }
  );

  return response.data;
};

export const getScanById = async (
  scanId
) => {
  const response = await api.get(
    `/scans/${scanId}`
  );

  return response.data;
};

export const deleteScan = async (scanId) => {
  const response = await api.delete(`/scans/${scanId}`);
  return response.data;
};
