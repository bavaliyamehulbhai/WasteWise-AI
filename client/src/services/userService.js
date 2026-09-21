import api from "./api";

export const getProfile = async () => {
  const response = await api.get(
    "/users/profile"
  );

  return response.data;
};

export const updateProfile = async (
  profileData
) => {
  const response = await api.put(
    "/users/profile",
    profileData
  );

  return response.data;
};

export const updateSettings = async (
  settings
) => {
  const response = await api.put(
    "/users/settings",
    settings
  );

  return response.data;
};

export const updatePassword = async (
  passwords
) => {
  const response = await api.put(
    "/users/password",
    passwords
  );

  return response.data;
};
