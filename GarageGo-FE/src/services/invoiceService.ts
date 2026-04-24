import { apiService } from './api';
import { Invoice, InvoiceCreateRequest } from '../types/invoice';

class InvoiceService {
  private readonly baseUrl = '/hoa-don';

  async getAll(): Promise<Invoice[]> {
    return apiService.get<Invoice[]>(this.baseUrl);
  }

  async getById(id: number): Promise<Invoice> {
    return apiService.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  async create(invoice: InvoiceCreateRequest): Promise<Invoice> {
    return apiService.post<Invoice>(this.baseUrl, invoice);
  }

  async complete(id: number): Promise<void> {
    return apiService.put<void>(`${this.baseUrl}/${id}/complete`);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const invoiceService = new InvoiceService();
