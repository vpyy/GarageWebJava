import { apiService } from './api';
import {
  Vehicle,
  VehicleCreateRequest,
  VehicleUpdateRequest,
} from '../types/vehicle';

class VehicleService {
  private readonly baseUrl = '/xe';

  async getAll(): Promise<Vehicle[]> {
    return apiService.get<Vehicle[]>(this.baseUrl);
  }

  async getById(id: number): Promise<Vehicle> {
    return apiService.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  async getByCustomer(maKH: number): Promise<Vehicle[]> {
    return apiService.get<Vehicle[]>(`${this.baseUrl}/ByKhachHang/${maKH}`);
  }

  async getByLicensePlate(bienSo: string): Promise<Vehicle> {
    return apiService.get<Vehicle>(`${this.baseUrl}/ByBienSo/${bienSo}`);
  }

  async create(vehicle: VehicleCreateRequest): Promise<Vehicle> {
    return apiService.post<Vehicle>(this.baseUrl, vehicle);
  }

  async update(id: number, vehicle: VehicleUpdateRequest): Promise<void> {
    return apiService.put<void>(`${this.baseUrl}/${id}`, vehicle);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const vehicleService = new VehicleService();
