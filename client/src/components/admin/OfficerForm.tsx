import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import {
  createOfficerSchema,
  CreateOfficerForm,
} from "../../validators/officer.validator";
import { useDistricts } from "../../hooks/useDistricts";
import { useTehsils } from "../../hooks/useTehsils";
import { useVillages } from "../../hooks/useVillages";
import { useCreateOfficer } from "../../hooks/useCreateOfficer";

interface Props {
  onSuccess: () => void;
}

export default function OfficerForm({ onSuccess }: Props) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOfficerForm>({
    resolver: zodResolver(createOfficerSchema) as any,
    defaultValues: {
      isActive: true,
      districtId: "",
      role: "DA",
    },
  });

  const role = watch("role");
  const districtId = watch("districtId");
  const tehsilId = watch("tehsilId");

  const { data: districtRes } = useDistricts();
  const { data: tehsilRes } = useTehsils(districtId);
  const { data: villageRes } = useVillages(tehsilId);
  const createOfficerMutation = useCreateOfficer();

  useEffect(() => {
    setValue("tehsilId", undefined);
    setValue("villageId", undefined);
  }, [districtId, setValue]);

  useEffect(() => {
    setValue("villageId", undefined);
  }, [tehsilId, setValue]);

  async function onSubmit(data: CreateOfficerForm) {
    await createOfficerMutation.mutateAsync({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role,
      districtId: data.districtId,
      tehsilId: data.tehsilId,
      villageId: data.villageId,
      isActive: data.isActive ?? true,
    });
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col">
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Ramesh Kumar Verma"
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <Input
          label="Official Email"
          type="email"
          placeholder="officer@hp.gov.in"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          placeholder="98XXXXXXXX"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="Initial Password"
          type="password"
          placeholder="Min 6 characters"
          {...register("password")}
          error={errors.password?.message}
        />

        <Select
          label="Official Role"
          {...register("role")}
          error={errors.role?.message}
          options={[
            { label: "Dealing Assistant (DA)", value: "DA" },
            { label: "Halqa Patwari", value: "PATWARI" },
            { label: "Tehsildar / Sub-Divisional Magistrate", value: "TEHSILDAR" },
          ]}
        />

        <Select
          label="Assigned District"
          {...register("districtId")}
          error={errors.districtId?.message}
          options={[
            { label: "Select District", value: "" },
            ...((districtRes?.data ?? []).map((district: any) => ({
              label: district.name,
              value: district.id,
            }))),
          ]}
        />

        <Select
          label="Assigned Tehsil"
          {...register("tehsilId")}
          error={errors.tehsilId?.message}
          disabled={!districtId}
          options={[
            { label: "Select Tehsil", value: "" },
            ...((tehsilRes?.data ?? []).map((tehsil: any) => ({
              label: tehsil.name,
              value: tehsil.id,
            }))),
          ]}
        />

        {role === "PATWARI" && (
          <Select
            label="Assigned Village / Patwar Circle"
            {...register("villageId")}
            error={errors.villageId?.message}
            disabled={!tehsilId}
            options={[
              { label: "Select Village", value: "" },
              ...((villageRes?.data ?? []).map((village: any) => ({
                label: village.name,
                value: village.id,
              }))),
            ]}
          />
        )}
      </div>

      <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t border-slate-100 bg-white pt-5">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting || createOfficerMutation.isPending}
        >
          Create Officer
        </Button>
      </div>
    </form>
  );
}