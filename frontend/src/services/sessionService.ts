import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/session`;

export const saveSessionToDB = async (data: any) => {
  const response = await axios.post(`${BASE_URL}/save`, data);
  return response.data;
};