import { useMemo } from "react";

import { useAuth } from "../../hooks/useAuth";
import { useProfileForm } from "../../hooks/useProfileForm";
import {
  useDistricts,
  useTehsils,
  useVillages,
} from "../../hooks/useLocations";

import ProfileForm from "../../components/profile/ProfileForm";
import PageHeader from "../../components/ui/PageHeader";

export default function ProfilePage() {
  const { user } = useAuth();

  const {
    control,
    register,
    handleSubmit,
    onSubmit,
    errors,
    districtId,
    tehsilId,
    isLoading,
    isSaving,
  } = useProfileForm();

  const { data: districts = [] } = useDistricts();

  const { data: tehsils = [] } = useTehsils(districtId);

  const { data: villages = [] } = useVillages(tehsilId);

  const districtOptions = useMemo(
    () =>
      districts.map((district) => ({
        label: district.name,
        value: district.id,
      })),
    [districts]
  );

  const tehsilOptions = useMemo(
    () =>
      tehsils.map((tehsil) => ({
        label: tehsil.name,
        value: tehsil.id,
      })),
    [tehsils]
  );

  const villageOptions = useMemo(
    () =>
      villages.map((village) => ({
        label: village.name,
        value: village.id,
      })),
    [villages]
  );

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-slate-500 text-lg">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Citizen Profile"
        subtitle="Manage your personal information"
      />

      <ProfileForm
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        districts={districtOptions}
        tehsils={tehsilOptions}
        villages={villageOptions}
        loading={isSaving}
        user={{
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        }}
      />
    </div>
  );
}