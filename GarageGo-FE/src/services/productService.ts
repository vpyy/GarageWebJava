import { apiService } from './api';
import { 
  Product, 
  Service, 
  ServiceRequest,
  CreateProductRequest, 
  UpdateProductRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateServiceRequestRequest
} from '@/types/product';

export class ProductService {
  // Product CRUD operations
  async getProducts(): Promise<Product[]> {
    return await apiService.get<Product[]>('/SanPham');
  }

  async getProduct(id: number): Promise<Product> {
    return await apiService.get<Product>(`/SanPham/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    // Backend expects exact model property names (PascalCase)
    const backendData = {
      TenSanPham: data.tenSP,
      Gia: data.donGia,
      SoLuongTon: data.soLuongTon,
      DonVi: data.donVi,
      MoTa: data.moTa,
      HinhAnh: data.hinhAnh
    };
    return await apiService.post<Product>('/SanPham', backendData);
  }

  async updateProduct(data: UpdateProductRequest): Promise<Product> {
    // Backend expects exact model property names (PascalCase)
    const backendData = {
      Id: data.maSP,
      TenSanPham: data.tenSP,
      Gia: data.donGia,
      SoLuongTon: data.soLuongTon,
      DonVi: data.donVi,
      MoTa: data.moTa,
      HinhAnh: data.hinhAnh
    };
    return await apiService.put<Product>(`/SanPham/${data.maSP}`, backendData);
  }

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/SanPham/${id}`);
  }

  // Service CRUD operations
  async getServices(): Promise<Service[]> {
    return await apiService.get<Service[]>('/DichVu');
  }

  async getService(id: number): Promise<Service> {
    return await apiService.get<Service>(`/DichVu/${id}`);
  }

  async createService(data: CreateServiceRequest): Promise<Service> {
    return await apiService.post<Service>('/DichVu', data);
  }

  async updateService(data: UpdateServiceRequest): Promise<Service> {
    return await apiService.put<Service>(`/DichVu/${data.maDV}`, data);
  }

  async deleteService(id: number): Promise<void> {
    await apiService.delete(`/DichVu/${id}`);
  }

  // Service Request operations
  async getServiceRequests(): Promise<ServiceRequest[]> {
    return await apiService.get<ServiceRequest[]>('/Yeucau');
  }

  async getServiceRequest(id: number): Promise<ServiceRequest> {
    return await apiService.get<ServiceRequest>(`/Yeucau/${id}`);
  }

  async createServiceRequest(data: CreateServiceRequestRequest): Promise<ServiceRequest> {
    return await apiService.post<ServiceRequest>('/Yeucau', data);
  }

  async updateServiceRequestStatus(id: number, status: string): Promise<ServiceRequest> {
    return await apiService.patch<ServiceRequest>(`/Yeucau/${id}/status`, { trangThai: status });
  }

  async deleteServiceRequest(id: number): Promise<void> {
    await apiService.delete(`/Yeucau/${id}`);
  }

  // Search operations
  async searchProducts(query: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/SanPham/search?q=${encodeURIComponent(query)}`);
  }

  async searchServices(query: string): Promise<Service[]> {
    return await apiService.get<Service[]>(`/DichVu/search?q=${encodeURIComponent(query)}`);
  }

  // Filter operations
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await apiService.get<Product[]>(`/SanPham/category/${category}`);
  }

  async getActiveServices(): Promise<Service[]> {
    return await apiService.get<Service[]>('/DichVu/active');
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return await apiService.get<Product[]>(`/SanPham/low-stock?threshold=${threshold}`);
  }
}

export const productService = new ProductService();