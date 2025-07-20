import { AxiosInstance } from "axios";
import {
  CreateAccountRequest,
  CreateBusinessRequest,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  ChangePasswordRequest
} from "@/types/apiRequest/account.request";
import {
  AccountMeResponse,
  AccountAuthorizationResponse,
  AccountExistsResponse,
  AccountBusinessResponse
} from "@/types/apiResponse/account.payload";
import { AxiosResponse } from "axios";

export function accountApi(axiosInstance: AxiosInstance) {
  return {
    // Create account
    createAccount(payload: CreateAccountRequest) {
      return axiosInstance.post<AccountMeResponse>("/account", payload);
    },

    // Create business
    createBusiness(payload: CreateBusinessRequest) {
      return axiosInstance.post<AccountBusinessResponse>("/account/business", payload);
    },

    // Update profile information
    updateProfile(payload: UpdateProfileRequest) {
      return axiosInstance.patch<AccountMeResponse>("/account/profile-information", payload);
    },

    // Get own account authorization
    getAccountAuthorization() {
      return axiosInstance.get<AccountAuthorizationResponse>("/account/me/authorization");
    },

    // Get own account details
    getAccountDetails() {
      return axiosInstance.get<AccountMeResponse>("/account/me");
    },

    // Forgot password
    forgotPassword(payload: ForgotPasswordRequest) {
      return axiosInstance.post<AxiosResponse<{ message: string }>>("/account/forgot-password", payload);
    },

    // Check if account exists
    checkAccountExists(email: string) {
      return axiosInstance.post<AccountExistsResponse>("/account/exists", { email });
    },

    // Reset password
    resetPassword(payload: ResetPasswordRequest) {
      return axiosInstance.post<AxiosResponse<{ message: string }>>("/account/reset-password", payload);
    },

    // Verify OTP
    verifyOtp(payload: VerifyOtpRequest) {
      return axiosInstance.post<AxiosResponse<{ message: string }>>("/account/verify-otp", payload);
    },

    // Change password
    changePassword(payload: ChangePasswordRequest) {
      return axiosInstance.post<AxiosResponse<{ message: string }>>("/account/change-password", payload);
    },

    // Get active business for account
    getActiveBusiness() {
      return axiosInstance.get<AccountBusinessResponse>('/account/business');
    },
  };
}
