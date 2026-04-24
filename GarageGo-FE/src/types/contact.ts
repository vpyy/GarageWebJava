export interface Contact {
  maLienHe: number;
  hoTen: string;
  email: string;
  soDienThoai: string;
  chuDe?: string;
  noiDung: string;
  ngayGui: string;
  daXuLy: boolean;
  username?: string;
}

export interface CreateContactRequest {
  hoTen: string;
  email: string;
  soDienThoai: string;
  chuDe?: string;
  noiDung: string;
  username?: string;
}

export interface UpdateContactRequest {
  maLienHe: number;
  daXuLy: boolean;
}
