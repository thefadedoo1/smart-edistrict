import api from "./api";

export async function getTehsils() {
  const res = await api.get("/tehsils");
  return res.data;
}

export async function getTehsilsByDistrict(
  districtId: string
) {
  const res = await api.get(
    `/tehsils/district/${districtId}`
  );

  return res.data;
}