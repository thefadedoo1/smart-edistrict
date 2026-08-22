import api from "./api";

export async function getVillages() {
  const res = await api.get("/villages");
  return res.data;
}

export async function getVillagesByTehsil(
  tehsilId: string
) {
  const res = await api.get(
    `/villages/tehsil/${tehsilId}`
  );

  return res.data;
}