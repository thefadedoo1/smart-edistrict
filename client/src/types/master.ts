export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  lgdCode: number;
}

export interface Tehsil {
  id: string;
  name: string;
  districtId: string;
  lgdCode: number;
}