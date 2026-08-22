import api from "./api";
import { CitizenProfile, ProfileResponse } from "../types/profile";

export const profileService = {
  async getProfile(): Promise<ProfileResponse> {
    const { data } = await api.get("/profile");
    return data;
  },

  async createProfile(
    profile: Partial<CitizenProfile>
  ): Promise<ProfileResponse> {
    const { data } = await api.post("/profile", profile);
    return data;
  },

  async updateProfile(
    profile: Partial<CitizenProfile>
  ): Promise<ProfileResponse> {
    const { data } = await api.patch("/profile", profile);
    return data;
  },
};