import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  profileSchema,
  ProfileFormData,
} from "../schemas/profile.schema";

import {
  useProfile,
  useCreateProfile,
  useUpdateProfile,
} from "./useProfile";

export function useProfileForm() {
  const profileQuery = useProfile();

  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      aadhaarNumber: "",
      gender: undefined,
      dateOfBirth: "",
      fatherName: "",
      motherName: "",
      address: "",
      pincode: "",
      districtId: "",
      tehsilId: "",
      villageId: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data?.data) return;

    const profile = profileQuery.data.data;

    reset({
      aadhaarNumber: profile.aadhaarNumber ?? "",
      gender: profile.gender ?? undefined,
      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.substring(0, 10)
        : "",
      fatherName: profile.fatherName ?? "",
      motherName: profile.motherName ?? "",
      address: profile.address ?? "",
      pincode: profile.pincode ?? "",
      districtId: profile.districtId ?? "",
      tehsilId: profile.tehsilId ?? "",
      villageId: profile.villageId ?? "",
    });
  }, [profileQuery.data, reset]);

  const districtId = watch("districtId");
  const tehsilId = watch("tehsilId");

  const onSubmit = async (
    values: ProfileFormData
  ) => {
    try {
      if (profileQuery.data?.data) {
        await updateMutation.mutateAsync(values);

        toast.success(
          "Profile updated successfully"
        );
      } else {
        await createMutation.mutateAsync(values);

        toast.success(
          "Profile created successfully"
        );
      }

      await profileQuery.refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          "Something went wrong"
      );
    }
  };

  return {
    control,
    register,
    handleSubmit,
    errors,
    onSubmit,

    districtId,
    tehsilId,

    profile: profileQuery.data?.data,

    isLoading: profileQuery.isLoading,

    isSaving:
      createMutation.isPending ||
      updateMutation.isPending,
  };
}