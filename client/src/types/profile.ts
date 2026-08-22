export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export interface District {
  id: string;
  name: string;
}

export interface Tehsil {
  id: string;
  name: string;
}

export interface Village {
  id: string;
  name: string;
}

export interface CitizenProfile {
  id: string;

  aadhaarNumber: string | null;

  gender: Gender | null;

  dateOfBirth: string | null;

  fatherName: string | null;

  motherName: string | null;

  address: string | null;

  pincode: string | null;

  districtId: string | null;

  tehsilId: string | null;

  villageId: string | null;

  district: District | null;

  tehsil: Tehsil | null;

  village: Village | null;

  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: CitizenProfile | null;
}