import api from "./api";

export async function getDepartments() {
  const res = await api.get("/departments");
  return res.data;
}