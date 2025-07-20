import {
  UpdateBusinessRequest,
  CreateBusinessTableRequest,
  ServicePointRequest
} from "@/types/apiRequest/business.request";
import {
  BusinessTable,
  BusinessTableListResponse,
  GetBusinessTablesQuery,
  ServicePoint,
  ServicePointListResponse,
  GetServicePointsQuery
} from "@/types/apiResponse/business.payload";
import { AxiosInstance, AxiosResponse } from "axios";

export function businessApi(axiosInstance: AxiosInstance) {
  return {
    updateBusiness(payload: UpdateBusinessRequest): Promise<AxiosResponse<UpdateBusinessRequest>> {
      return axiosInstance.patch("/business", payload);
    },
    // Create a business table
    createTable(payload: CreateBusinessTableRequest): Promise<AxiosResponse<BusinessTable>> {
      return axiosInstance.post("/business/table", payload);
    },
    // Get all business tables
    getAllTables(params?: GetBusinessTablesQuery): Promise<AxiosResponse<BusinessTableListResponse>> {
      return axiosInstance.get("/business/table", { params });
    },
    // Create a business service point
    createServicePoint(payload: ServicePointRequest): Promise<AxiosResponse<ServicePoint>> {
      return axiosInstance.post("/business/business/service-point", payload);
    },
    // Update a service point
    updateServicePoint(servicePointId: string, payload: ServicePointRequest): Promise<AxiosResponse<ServicePoint>> {
      return axiosInstance.patch(`/business/business/service-point/${servicePointId}`, payload);
    },
    // Get all service points
    getAllServicePoints(params?: GetServicePointsQuery): Promise<AxiosResponse<ServicePointListResponse>> {
      return axiosInstance.get("/business/service-point", { params });
    },
    // Get business details by id
    getBusinessDetails(businessId: string): Promise<AxiosResponse<UpdateBusinessRequest>> {
      return axiosInstance.get(`/business/${businessId}`);
    },
  };
}
