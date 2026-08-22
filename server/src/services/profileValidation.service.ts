import prisma from "../config/prisma";

const REQUIRED_FIELDS = [
  {
    key: "aadhaarNumber",
    label: "Aadhaar Number",
  },
  {
    key: "fatherName",
    label: "Father Name",
  },
  {
    key: "gender",
    label: "Gender",
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
  },
  {
    key: "address",
    label: "Address",
  },
  {
    key: "pincode",
    label: "Pincode",
  },
  {
    key: "districtId",
    label: "District",
  },
  {
    key: "tehsilId",
    label: "Tehsil",
  },
  {
    key: "villageId",
    label: "Village",
  },
] as const;

export async function validateCitizenProfile(
  userId: string
) {
  const profile =
    await prisma.citizenProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!profile) {
    return {
      complete: false,
      percentage: 0,
      missingFields: [
        "Citizen Profile",
      ],
    };
  }

  const missingFields: string[] =
    [];

  let completed = 0;

  for (const field of REQUIRED_FIELDS) {
    const value =
      profile[field.key];

    const hasValue =
      value !== null &&
      value !== undefined &&
      value !== "";

    if (hasValue) {
      completed++;
    } else {
      missingFields.push(
        field.label
      );
    }
  }

  const percentage = Math.round(
    (completed /
      REQUIRED_FIELDS.length) *
      100
  );

  return {
    complete:
      missingFields.length === 0,

    percentage,

    missingFields,
  };
}