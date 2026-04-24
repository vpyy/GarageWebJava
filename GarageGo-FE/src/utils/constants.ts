// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    LOGOUT: '/Auth/logout',
    REFRESH: '/Auth/refresh',
    ME: '/Auth/me',
  },
  CUSTOMERS: '/KhachHang',
  VEHICLES: '/Xe',
  PRODUCTS: '/SanPham',
  SERVICES: '/DichVu',
  INVOICES: '/HoaDon',
  SERVICE_REQUESTS: '/Yeucau',
  CONTACTS: '/LienHe',
  STATISTICS: '/ThongKe',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  CUSTOMER: 'Customer',
} as const;

// Invoice Status
export const INVOICE_STATUS = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
} as const;

// Service Request Status
export const SERVICE_REQUEST_STATUS = {
  NEW: 'Mới',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang thực hiện',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: 'yyyy-MM-ddTHH:mm:ss',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState',
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    CREATE: 'Tạo mới thành công!',
    UPDATE: 'Cập nhật thành công!',
    DELETE: 'Xóa thành công!',
    LOGIN: 'Đăng nhập thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    REGISTER: 'Đăng ký thành công!',
  },
  ERROR: {
    CREATE: 'Có lỗi xảy ra khi tạo mới!',
    UPDATE: 'Có lỗi xảy ra khi cập nhật!',
    DELETE: 'Có lỗi xảy ra khi xóa!',
    LOGIN: 'Đăng nhập thất bại!',
    REGISTER: 'Đăng ký thất bại!',
    NETWORK: 'Lỗi kết nối mạng!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập!',
    NOT_FOUND: 'Không tìm thấy dữ liệu!',
    VALIDATION: 'Dữ liệu không hợp lệ!',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL: 'Email không hợp lệ',
  PHONE: 'Số điện thoại không hợp lệ',
  MIN_LENGTH: (min: number) => `Tối thiểu ${min} ký tự`,
  MAX_LENGTH: (max: number) => `Tối đa ${max} ký tự`,
  MIN_VALUE: (min: number) => `Giá trị tối thiểu là ${min}`,
  MAX_VALUE: (max: number) => `Giá trị tối đa là ${max}`,
  PASSWORD_MATCH: 'Mật khẩu không khớp',
  POSITIVE_NUMBER: 'Phải là số dương',
  INTEGER: 'Phải là số nguyên',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  SECONDARY: '#64748b',
  GRADIENT: ['#3b82f6', '#1d4ed8', '#1e40af'],
} as const;
