export interface Officer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "DA" | "PATWARI" | "TEHSILDAR" | "ADMIN";
  isActive: boolean;
  departmentId: string | null;
  districtId: string | null;
  tehsilId: string | null;
  villageId?: string | null;

  department?: {
    id: string;
    name: string;
  };
  district?: {
    id: string;
    name: string;
  };
  tehsil?: {
    id: string;
    name: string;
  };
  village?: {
    id: string;
    name: string;
  };
}

export interface CreateOfficerPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "DA" | "PATWARI" | "TEHSILDAR";
  departmentId?: string;
  districtId?: string;
  tehsilId?: string;
  villageId?: string;
  isActive?: boolean;
}