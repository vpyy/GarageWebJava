import { apiService } from './api';
import {
  ServiceRequest,
  ServiceRequestCreateRequest,
  ServiceRequestUpdateRequest,
} from '../types/request';

class RequestService {
  private readonly baseUrl = '/yeu-cau';

  async getAll(): Promise<ServiceRequest[]> {
    return apiService.get<ServiceRequest[]>(this.baseUrl);
  }

  async getById(id: number): Promise<ServiceRequest> {
    return apiService.get<ServiceRequest>(`${this.baseUrl}/${id}`);
  }

  async create(request: ServiceRequestCreateRequest): Promise<ServiceRequest> {
    return apiService.post<ServiceRequest>(this.baseUrl, request);
  }

  async update(
    id: number,
    request: ServiceRequestUpdateRequest
  ): Promise<void> {
    return apiService.put<void>(`${this.baseUrl}/${id}`, request);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const requestService = new RequestService();
