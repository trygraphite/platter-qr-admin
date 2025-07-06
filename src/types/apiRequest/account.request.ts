export interface CreateAccountRequest {
    password: string;
    email: string;
    phone: string;
    country: string;
    firstName: string;
    lastName: string;
}

export interface BusinessAddress {
    address: string;
    city: string;
    country: string;
    postalCode: string;
    proofOfAddress: string;
    latitude: string;
    longitude: string;
}

export interface BusinessHour {
    day: string; // e.g., 'monday'
    opening: string; // e.g., '08:00'
    closing: string; // e.g., '17:00'
}

export interface CreateBusinessRequest {
    name: string;
    description: string;
    subdomain: string;
    website: string;
    socials: string[]; // or a more specific type if needed
    address: BusinessAddress;
    logo: string;
    image: string;
    contactEmail: string;
    contactName: string;
    contactPhone: string;
    hours: BusinessHour[];
}

export interface UpdateProfileRequest {
    phone: string;
    photo: string;
    firstName: string;
    lastName: string;
    country: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    signature: string;
    otp: string;
    password: string;
}

export interface VerifyOtpRequest {
    signature: string;
    otp: string;
}

export interface ChangePasswordRequest {
    password: string;
    oldPassword: string;
}

export interface LoginRequest {
    username: string;
    password: string;
    type: string;
}
