import React, { useState } from 'react';

export const CustomerManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data giống như trong .cshtml
  const mockCustomers = [
    {
      maKH: 1,
      tenKH: 'Nguyễn Văn A',
      sdt: '0123456789',
      email: 'nguyenvana@email.com',
      diaChi: '123 Đường ABC, Quận 1, TP.HCM',
      ngayDangKy: '2024-01-15',
      soXe: 2,
    },
    {
      maKH: 2,
      tenKH: 'Trần Thị B',
      sdt: '0987654321',
      email: 'tranthib@email.com',
      diaChi: '456 Đường DEF, Quận 2, TP.HCM',
      ngayDangKy: '2024-01-10',
      soXe: 1,
    },
    {
      maKH: 3,
      tenKH: 'Lê Văn C',
      sdt: '0369852147',
      email: 'levanc@email.com',
      diaChi: '789 Đường GHI, Quận 3, TP.HCM',
      ngayDangKy: '2024-01-08',
      soXe: 3,
    },
    {
      maKH: 4,
      tenKH: 'Phạm Thị D',
      sdt: '0147258369',
      email: 'phamthid@email.com',
      diaChi: '321 Đường JKL, Quận 4, TP.HCM',
      ngayDangKy: '2024-01-05',
      soXe: 1,
    },
    {
      maKH: 5,
      tenKH: 'Hoàng Văn E',
      sdt: '0258147369',
      email: 'hoangvane@email.com',
      diaChi: '654 Đường MNO, Quận 5, TP.HCM',
      ngayDangKy: '2024-01-03',
      soXe: 2,
    },
  ];

  const colors = ['2377FC', '22C55E', 'FF9F43', '7367F0', 'FF5200'];

  const filteredCustomers = mockCustomers.filter(
    customer =>
      customer.tenKH.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.sdt.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            Khách hàng
          </h3>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#64748b',
            }}
          >
            <a
              href="/admin/dashboard"
              style={{ color: '#64748b', textDecoration: 'none' }}
            >
              Dashboard
            </a>
            <i
              className="fas fa-chevron-right"
              style={{ margin: '0 8px', fontSize: '12px' }}
            ></i>
            <span>Khách hàng</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: 1,
              maxWidth: '400px',
            }}
          >
            <i
              className="fas fa-search"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px',
              }}
            ></i>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                width: '100%',
                outline: 'none',
              }}
              onFocus={e => {
                e.target.style.borderColor = '#2377FC';
                e.target.style.boxShadow = '0 0 0 3px rgba(35, 119, 252, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #2377FC 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(35, 119, 252, 0.3)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-plus"></i> Thêm khách hàng
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Khách hàng
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Mã KH
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Số điện thoại
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Ngày đăng ký
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Số xe
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    background: '#f8fafc',
                  }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => {
                const colorIndex = customer.maKH % 5;
                return (
                  <tr
                    key={customer.maKH}
                    style={{
                      borderBottom:
                        index < filteredCustomers.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.tenKH)}&background=${colors[colorIndex]}&color=fff&size=50`}
                          alt={customer.tenKH}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#1e293b',
                              marginBottom: '2px',
                            }}
                          >
                            {customer.tenKH}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#64748b',
                            }}
                          >
                            {customer.diaChi || 'Chưa có địa chỉ'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1e293b',
                        }}
                      >
                        #{customer.maKH}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '14px',
                        color: '#1e293b',
                      }}
                    >
                      {customer.sdt}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '14px',
                        color: '#1e293b',
                      }}
                    >
                      {customer.email || '-'}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '14px',
                        color: '#64748b',
                      }}
                    >
                      {new Date(customer.ngayDangKy).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        {customer.soXe} xe
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        Hoạt động
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#dbeafe';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'none';
                          }}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f59e0b',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#fef3c7';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'none';
                          }}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = 'none';
                          }}
                          title="Xóa"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#64748b',
            }}
          >
            <i
              className="fas fa-users"
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}
            ></i>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Không tìm thấy khách hàng
            </div>
            <div style={{ fontSize: '14px' }}>
              Thử thay đổi từ khóa tìm kiếm
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
