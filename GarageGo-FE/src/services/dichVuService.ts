/**
 * DichVu (Service) API Service
 * Gửi requests đến backend API
 */

import { apiService } from './api'; // Axios instance với interceptors

export interface DichVu {
  id?: number;
  name: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DichVuRequest {
  name: string;
  price: number;
  description?: string;
}

class DichVuService {
  /**
   * Lấy tất cả dịch vụ
   */
  async getAllDichVu(): Promise<DichVu[]> {
    try {
      return await apiService.get<DichVu[]>('/dichvu');
    } catch (error) {
      console.error('Error fetching dichvu list:', error);
      throw error;
    }
  }

  /**
   * Lấy dịch vụ theo ID
   */
  async getDichVuById(id: number): Promise<DichVu> {
    try {
      return await apiService.get<DichVu>(`/dichvu/${id}`);
    } catch (error) {
      console.error(`Error fetching dichvu ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo dịch vụ mới
   */
  async createDichVu(data: DichVuRequest): Promise<DichVu> {
    try {
      return await apiService.post<DichVu>('/dichvu', data);
    } catch (error) {
      console.error('Error creating dichvu:', error);
      throw error;
    }
  }

  /**
   * Cập nhật dịch vụ
   */
  async updateDichVu(id: number, data: DichVuRequest): Promise<DichVu> {
    try {
      return await apiService.put<DichVu>(`/dichvu/${id}`, data);
    } catch (error) {
      console.error(`Error updating dichvu ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa dịch vụ
   */
  async deleteDichVu(id: number): Promise<void> {
    try {
      await apiService.delete(`/dichvu/${id}`);
    } catch (error) {
      console.error(`Error deleting dichvu ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tìm kiếm dịch vụ theo tên
   */
  async searchDichVu(name: string): Promise<DichVu[]> {
    try {
      return await apiService.get<DichVu[]>('/dichvu', {
        params: { search: name },
      });
    } catch (error) {
      console.error('Error searching dichvu:', error);
      throw error;
    }
  }
}

export const dichVuService = new DichVuService();
