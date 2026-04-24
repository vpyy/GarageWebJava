import { apiService } from './api';
import {
  Product,
  Service,
  ServiceRequest,
  CreateProductRequest,
  UpdateProductRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateServiceRequestRequest,
} from '@/types/product';

export class ProductService {
  // Product CRUD operations
  async getProducts(): Promise<Product[]> {
    return await apiService.get<Product[]>('/san-pham');
  }

  async getProduct(id: number): Promise<Product> {
    return await apiService.get<Product>(`/san-pham/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    // Backend accepts camelCase with @JsonAlias support
    const backendData = {
      tenSanPham: data.tenSP,
      gia: data.donGia,
      soLuongTon: data.soLuongTon,
      donVi: data.donVi,
      moTa: data.moTa,
      hinhAnh: data.hinhAnh,
    };
    return await apiService.post<Product>('/san-pham', backendData);
  }

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    // Backend accepts camelCase with @JsonAlias support
    const backendData = {
      id: data.maSP,
      tenSanPham: data.tenSP,
      gia: data.donGia,
      soLuongTon: data.soLuongTon,
      donVi: data.donVi,
      moTa: data.moTa,
      hinhAnh: data.hinhAnh,
    };
    return await apiService.put<Product>(`/san-pham/${data.maSP}`, backendData);
  }

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/san-pham/${id}`);
  }

  // Service CRUD operations
  async getServices(): Promise<Service[]> {
    return await apiService.get<Service[]>('/dich-vu');
  }

  async getService(id: number): Promise<Service> {
    return await apiService.get<Service>(`/dich-vu/${id}`);
  }

  async createService(data: CreateServiceRequest): Promise<Service> {
    // Backend accepts camelCase with @JsonAlias support
    const backendData = {
      tenDichVu: data.tenDV,
      gia: data.donGia,
      moTa: data.moTa,
      hinhAnh: data.hinhAnh,
      trangThai: data.trangThai,
    };
    return await apiService.post<Service>('/dich-vu', backendData);
  }

  async updateService(data: UpdateServiceRequest): Promise<Service> {
    // Backend accepts camelCase with @JsonAlias support
    const backendData = {
      tenDichVu: data.tenDV,
      gia: data.donGia,
      moTa: data.moTa,
      hinhAnh: data.hinhAnh,
      trangThai: data.trangThai,
    };
    return await apiService.put<Service>(`/dich-vu/${data.maDV}`, backendData);
  }

  async deleteService(id: number): Promise<void> {
    await apiService.delete(`/dich-vu/${id}`);
  }

  // Service Request operations
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return await apiService.get<ServiceRequest[]>('/yeu-cau');
  }

  async getServiceRequest(id: number): Promise<ServiceRequest> {
    return await apiService.get<ServiceRequest>(`/yeu-cau/${id}`);
  }

  async createServiceRequest(
    data: CreateServiceRequestRequest
  ): Promise<ServiceRequest> {
    return await apiService.post<ServiceRequest>('/yeu-cau', data);
  }

  async updateServiceRequestStatus(
    id: number,
    status: string
  ): Promise<ServiceRequest> {
    return await apiService.patch<ServiceRequest>(`/yeu-cau/${id}/status`, {
      trangThai: status,
    });
  }

  async deleteServiceRequest(id: number): Promise<void> {
    await apiService.delete(`/yeu-cau/${id}`);
  }

  // Search operations
  async searchProducts(query: string): Promise<Product[]> {
    return await apiService.get<Product[]>(
      `/san-pham/search?q=${encodeURIComponent(query)}`
    );
  }

  async searchServices(query: string): Promise<Service[]> {
    return await apiService.get<Service[]>(
      `/dich-vu/search?q=${encodeURIComponent(query)}`
    );
  }

  // Filter operations
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/san-pham/category/${category}`);
  }

  async getActiveServices(): Promise<Service[]> {
    return await apiService.get<Service[]>('/dich-vu/active');
  }

  async getLowStockProducts(threshold = 10): Promise<Product[]> {
    return await apiService.get<Product[]>(
      `/san-pham/low-stock?threshold=${threshold}`
    );
  }
}

export const productService = new ProductService();
