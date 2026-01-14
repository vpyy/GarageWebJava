import { apiService } from './api';
import { Service, ServiceCreateRequest, ServiceUpdateRequest } from '../types/service';

class ServiceService {
  private readonly baseUrl = '/DichVu';

  async getAll(): Promise<Service[]> {
    return apiService.get<Service[]>(this.baseUrl);
  }

  async getActive(): Promise<Service[]> {
    return apiService.get<Service[]>(`${this.baseUrl}/Active`);
  }

  async getById(id: number): Promise<Service> {
    return apiService.get<Service>(`${this.baseUrl}/${id}`);
  }

  async create(service: ServiceCreateRequest): Promise<Service> {
    return apiService.post<Service>(this.baseUrl, service);
  }

  async update(id: number, service: ServiceUpdateRequest): Promise<void> {
    return apiService.put<void>(`${this.baseUrl}/${id}`, service);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const serviceService = new ServiceService();