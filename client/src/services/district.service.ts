import api from "./api";

export async function getDistricts() {
  const res = await api.get("/districts");
  return res.data;
}