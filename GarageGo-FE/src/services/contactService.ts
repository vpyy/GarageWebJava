import { apiService } from './api';
import { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contact';

export class ContactService {
  // Contact CRUD operations
  async getContacts(): Promise<Contact[]> {
    return await apiService.get<Contact[]>('/LienHe');
  }

  async create(data: CreateContactRequest): Promise<{ maLienHe: number; message: string }> {
    return await apiService.post<{ maLienHe: number; message: string }>('/LienHe', data);
  }

  async createContact(data: CreateContactRequest): Promise<{ maLienHe: number; message: string }> {
    return await apiService.post<{ maLienHe: number; message: string }>('/LienHe', data);
  }

  async updateContactStatus(id: number, daXuLy: boolean): Promise<{ updated: number }> {
    return await apiService.put<{ updated: number }>(`/LienHe/update-status?id=${id}&daxuly=${daXuLy}`, {});
  }

  // Statistics
  async getContactStats(): Promise<{
    total: number;
    processed: number;
    unprocessed: number;
    thisMonth: number;
    lastMonth: number;
  }> {
    const contacts = await this.getContacts();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
      total: contacts.length,
      processed: contacts.filter(c => c.daXuLy).length,
      unprocessed: contacts.filter(c => !c.daXuLy).length,
      thisMonth: contacts.filter(c => new Date(c.ngayGui) >= thisMonth).length,
      lastMonth: contacts.filter(c => {
        const date = new Date(c.ngayGui);
        return date >= lastMonth && date <= lastMonthEnd;
      }).length
    };
  }
}

export const contactService = new ContactService();