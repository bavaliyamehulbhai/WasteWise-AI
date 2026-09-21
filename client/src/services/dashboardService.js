import api from "./api";

export const getDashboard = async () => {
  const response = await api.get(
    "/dashboard"
  );

  return response.data;
};

export const getDashboardTrends = async (range = 30) => {
  const response = await api.get("/dashboard/trends", {
    params: { range },
  });

  return response.data;
};
