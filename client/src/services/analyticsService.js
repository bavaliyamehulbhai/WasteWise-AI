import api from "./api";

export const getAnalytics = async (range = 30) => {
  const response = await api.get("/analytics", {
    params: { range },
  });
  return response.data;
};
