import { apiService } from './api';
import {
  Customer,
  Vehicle,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '@/types/customer';

export class CustomerService {
  // Customer CRUD operations
  async getCustomers(): Promise<Customer[]> {
    return await apiService.get<Customer[]>('/khach-hang');
  }

  async getCustomer(id: number): Promise<Customer> {
    return await apiService.get<Customer>(`/khach-hang/${id}`);
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return await apiService.post<Customer>('/khach-hang', data);
  }

  async updateCustomer(data: UpdateCustomerRequest): Promise<Customer> {
    return await apiService.put<Customer>(`/khach-hang/${data.maKH}`, data);
  }

  async deleteCustomer(id: number): Promise<void> {
    await apiService.delete(`/khach-hang/${id}`);
  }

  // Vehicle CRUD operations
  async getVehicles(): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>('/xe');
  }

  async getVehicle(id: number): Promise<Vehicle> {
    return await apiService.get<Vehicle>(`/xe/${id}`);
  }

  async getVehiclesByCustomer(customerId: number): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>(`/xe/customer/${customerId}`);
  }

  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    return await apiService.post<Vehicle>('/xe', data);
  }

  async updateVehicle(data: UpdateVehicleRequest): Promise<Vehicle> {
    return await apiService.put<Vehicle>(`/xe/${data.maXe}`, data);
  }

  async deleteVehicle(id: number): Promise<void> {
    await apiService.delete(`/xe/${id}`);
  }

  // Search and filter
  async searchCustomers(query: string): Promise<Customer[]> {
    return await apiService.get<Customer[]>(
      `/khach-hang/search?q=${encodeURIComponent(query)}`
    );
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>(
      `/xe/search?q=${encodeURIComponent(query)}`
    );
  }
}

export const customerService = new CustomerService();
