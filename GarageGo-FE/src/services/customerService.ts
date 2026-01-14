import { apiService } from './api';
import { Customer, Vehicle, CreateCustomerRequest, UpdateCustomerRequest, CreateVehicleRequest, UpdateVehicleRequest } from '@/types/customer';

export class CustomerService {
  // Customer CRUD operations
  async getCustomers(): Promise<Customer[]> {
    return await apiService.get<Customer[]>('/KhachHang');
  }

  async getCustomer(id: number): Promise<Customer> {
    return await apiService.get<Customer>(`/KhachHang/${id}`);
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    return await apiService.post<Customer>('/KhachHang', data);
  }

  async updateCustomer(data: UpdateCustomerRequest): Promise<Customer> {
    return await apiService.put<Customer>(`/KhachHang/${data.maKH}`, data);
  }

  async deleteCustomer(id: number): Promise<void> {
    await apiService.delete(`/KhachHang/${id}`);
  }

  // Vehicle CRUD operations
  async getVehicles(): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>('/Xe');
  }

  async getVehicle(id: number): Promise<Vehicle> {
    return await apiService.get<Vehicle>(`/Xe/${id}`);
  }

  async getVehiclesByCustomer(customerId: number): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>(`/Xe/customer/${customerId}`);
  }

  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    return await apiService.post<Vehicle>('/Xe', data);
  }

  async updateVehicle(data: UpdateVehicleRequest): Promise<Vehicle> {
    return await apiService.put<Vehicle>(`/Xe/${data.maXe}`, data);
  }

  async deleteVehicle(id: number): Promise<void> {
    await apiService.delete(`/Xe/${id}`);
  }

  // Search and filter
  async searchCustomers(query: string): Promise<Customer[]> {
    return await apiService.get<Customer[]>(`/KhachHang/search?q=${encodeURIComponent(query)}`);
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    return await apiService.get<Vehicle[]>(`/Xe/search?q=${encodeURIComponent(query)}`);
  }
}

export const customerService = new CustomerService();