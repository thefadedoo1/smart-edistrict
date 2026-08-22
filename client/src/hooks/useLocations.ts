import { useQuery } from "@tanstack/react-query";
import { locationService } from "../services/location.service";

export const useDistricts = () =>
  useQuery({
    queryKey: ["districts"],
    queryFn: locationService.getDistricts,
  });

export const useTehsils = (districtId?: string) =>
  useQuery({
    queryKey: ["tehsils", districtId],
    queryFn: () => locationService.getTehsils(districtId!),
    enabled: !!districtId,
  });

export const useVillages = (tehsilId?: string) =>
  useQuery({
    queryKey: ["villages", tehsilId],
    queryFn: () => locationService.getVillages(tehsilId!),
    enabled: !!tehsilId,
  });