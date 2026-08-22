import {
  Controller,
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import { ProfileFormData } from "../../schemas/profile.schema";

import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";
import TextAreaField from "../forms/TextAreaField";
import FormSection from "../forms/FormSection";
import Button from "../ui/Button";

interface Option {
  label: string;
  value: string;
}

interface UserInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  control: Control<ProfileFormData>;

  register: UseFormRegister<ProfileFormData>;

  handleSubmit: UseFormHandleSubmit<ProfileFormData>;

  onSubmit: SubmitHandler<ProfileFormData>;

  errors: FieldErrors<ProfileFormData>;

  districts: Option[];
  tehsils: Option[];
  villages: Option[];

  user: UserInfo;

  loading?: boolean;
}

export default function ProfileForm({
  control,
  register,
  handleSubmit,
  onSubmit,
  errors,
  districts,
  tehsils,
  villages,
  user,
  loading = false,
}: ProfileFormProps) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Personal Information */}

      <FormSection
        title="Personal Information"
        subtitle="Basic account information"
      >
        <InputField
          label="Full Name"
          value={user.fullName}
          disabled
        />

        <InputField
          label="Email"
          value={user.email}
          disabled
        />

        <InputField
          label="Phone"
          value={user.phone}
          disabled
        />

        <SelectField
          label="Gender"
          options={[
            {
              label: "Male",
              value: "MALE",
            },
            {
              label: "Female",
              value: "FEMALE",
            },
            {
              label: "Other",
              value: "OTHER",
            },
          ]}
          error={errors.gender?.message}
          {...register("gender")}
        />

        <InputField
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
      </FormSection>

      {/* Family Information */}

      <FormSection
        title="Family Information"
        subtitle="Family details"
      >
        <InputField
          label="Father's Name"
          error={errors.fatherName?.message}
          {...register("fatherName")}
        />

        <InputField
          label="Mother's Name"
          error={errors.motherName?.message}
          {...register("motherName")}
        />
      </FormSection>

      {/* Address Information */}

      <FormSection
        title="Address Information"
        subtitle="Permanent address"
      >
        <Controller
          name="districtId"
          control={control}
          render={({ field }) => (
            <SelectField
              label="District"
              options={districts}
              error={errors.districtId?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Controller
          name="tehsilId"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Tehsil"
              options={tehsils}
              error={errors.tehsilId?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <Controller
          name="villageId"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Village"
              options={villages}
              error={errors.villageId?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />

        <TextAreaField
          label="Address"
          rows={4}
          error={errors.address?.message}
          {...register("address")}
        />

        <InputField
          label="Pincode"
          maxLength={6}
          error={errors.pincode?.message}
          {...register("pincode")}
        />
      </FormSection>

      {/* Identity Information */}

      <FormSection
        title="Identity Information"
        subtitle="Government identity details"
      >
        <InputField
          label="Aadhaar Number"
          maxLength={12}
          error={errors.aadhaarNumber?.message}
          {...register("aadhaarNumber")}
        />
      </FormSection>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          size="lg"
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
}