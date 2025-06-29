export interface EmailValue {
    value: string;
}

export interface BusinessSummary {
    _id: string;
    name: string;
    logo: string;
    image: string;
}

export interface AccountSummary {
    _id: string;
    firstName: string;
    lastName: string;
    email: EmailValue;
    phone: string;
    country: string;
}

export interface CreatedBySummary {
    _id: string;
    firstName: string;
    lastName: string;
    email: EmailValue;
}

export interface Permission {
    authorization: string;
    claim: string[];
}

export interface AccountAuthorizationData {
    _id: string;
    business: BusinessSummary;
    account: AccountSummary;
    isActive: boolean;
    isPrimary: boolean;
    createdBy: CreatedBySummary;
    permissions: Permission[];
}

export interface AccountAuthorizationResponse {
    path: string;
    message: string;
    timestamp: string;
    data: AccountAuthorizationData;
}

export interface AccountMeEmail {
    value: string;
    verified: boolean;
}

export interface AccountMePermission {
    authorization: string;
    claim: string[];
}

export interface AccountMeBusiness {
    _id: string;
    name: string;
    logo: string;
    image: string;
    isPrimary: boolean;
}

export interface AccountMeData {
    id: string;
    lastName: string;
    firstName: string;
    country: string;
    email: AccountMeEmail;
    address: Record<string, unknown>;
    phone: string;
    photo: string | null;
    identity: string | null;
    identityType: string | null;
    identityNumber: string | null;
    permissions: AccountMePermission[];
    businesses: AccountMeBusiness[];
    designation: string;
}

export interface AccountMeResponse {
    path: string;
    message: string;
    timestamp: string;
    data: AccountMeData;
}

export interface AccountExistsEmail {
    value: string;
    verified: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface AccountExistsData {
    _id: string;
    firstName: string;
    lastName: string;
    country: string;
    email: AccountExistsEmail;
    phone: string;
}

export interface AccountExistsResponse {
    path: string;
    message: string;
    timestamp: string;
    data: AccountExistsData;
}
