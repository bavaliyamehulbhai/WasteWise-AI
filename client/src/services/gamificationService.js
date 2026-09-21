import api from "./api";

export const getGamification = async () => {
  const response = await api.get("/gamification");
  return response.data;
};
