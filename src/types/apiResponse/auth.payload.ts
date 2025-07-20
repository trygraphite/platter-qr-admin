export interface LoginAccountData {
  id: string;
  lastName: string;
  firstName: string;
  country: string;
  email: {
    value: string;
    verified: boolean;
  };
  address: Record<string, unknown>;
  phone: string;
  photo: string | null;
  identity: string | null;
  identityType: string | null;
  identityNumber: string | null;
  accountType: string;
  designation: string;
}

export interface LoginResponseData {
  account: LoginAccountData;
  authorization: string;
}

export interface LoginResponse {
  path: string;
  message: string;
  timestamp: string;
  data: LoginResponseData;
}
