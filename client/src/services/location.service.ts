import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface LocationOption {
  id: string;
  name: string;
}

export const locationService = {
  async getDistricts() {
    const { data } = await api.get<ApiResponse<LocationOption[]>>(
      "/districts"
    );

    return data.data;
  },

  async getTehsils(districtId: string) {
    const { data } = await api.get<ApiResponse<LocationOption[]>>(
      `/tehsils/district/${districtId}`
    );

    return data.data;
  },

  async getVillages(tehsilId: string) {
    const { data } = await api.get<ApiResponse<LocationOption[]>>(
      `/villages/tehsil/${tehsilId}`
    );

    return data.data;
  },
};