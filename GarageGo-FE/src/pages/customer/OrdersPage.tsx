import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';

interface OrderItem {
  maSP: number;
  tenSP: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

interface Order {
  maHD: number;
  hoTen: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  ghiChu: string;
  phuongThucThanhToan: string;
  tongTien: number;
  trangThai: string;
  ngayTao: string;
  sanPhams: OrderItem[];
}

const statusStyle = (s: string) => {
  switch (s) {
    case 'Chờ xác nhận': return { bg: '#fef9c3', color: '#a16207', icon: 'fa-clock' };
    case 'Đang xử lý':   return { bg: '#dbeafe', color: '#1d4ed8', icon: 'fa-spinner' };
    case 'Hoàn thành':   return { bg: '#dcfce7', color: '#15803d', icon: 'fa-check-circle' };
    case 'Hủy':          return { bg: '#fee2e2', color: '#b91c1c', icon: 'fa-times-circle' };
    default:             return { bg: '#f1f5f9', color: '#64748b', icon: 'fa-circle' };
  }
};

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '-';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Lấy đơn hàng của user hiện tại
      const data = await apiService.get<Order[]>(`/don-hang/my-orders`);
      setOrders(data);
    } catch {
      // Fallback: lấy tất cả và lọc theo email/username
      try {
        const all = await apiService.get<Order[]>('/don-hang');
        const mine = all.filter(
          (o: Order) =>
            o.email === user?.email ||
            o.email === user?.username ||
            o.soDienThoai === user?.username
        );
        setOrders(mine);
      } catch {
        toast.error('Lỗi khi tải lịch sử đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  return (
    <div style={{ minHeight: '80vh', background: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              <i className="fas fa-shopping-bag me-2" style={{ color: '#0ea5e9' }} />
              Lịch sử đơn hàng
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              {orders.length} đơn hàng
            </p>
          </div>
          <button
            onClick={loadOrders}
            style={{
              padding: '8px 16px', background: 'white',
              border: '1px solid #e5e7eb', borderRadius: '8px',
              color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}
          >
            <i className="fas fa-sync-alt me-1" />Làm mới
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <i className="fas fa-shopping-bag" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }} />
            <h3 style={{ color: '#64748b', marginBottom: '8px' }}>Chưa có đơn hàng nào</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
            <a
              href="/customer/products"
              style={{
                display: 'inline-block', marginTop: '16px', padding: '10px 24px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600,
              }}
            >
              Mua sắm ngay
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => {
              const st = statusStyle(order.trangThai);
              return (
                <div
                  key={order.maHD}
                  style={{
                    background: 'white', borderRadius: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #f1f5f9', overflow: 'hidden',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: '14px 20px', background: '#f8fafc',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexWrap: 'wrap', gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                        Đơn hàng #{order.maHD}
                      </span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                        <i className="fas fa-calendar me-1" />{fmtDate(order.ngayTao)}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: '5px 14px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 700,
                        background: st.bg, color: st.color,
                      }}
                    >
                      <i className={`fas ${st.icon} me-1`} />{order.trangThai || 'Chờ xác nhận'}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>KHÁCH HÀNG</div>
                        <div style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>{order.hoTen}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>THANH TOÁN</div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {order.phuongThucThanhToan === 'COD' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>SẢN PHẨM</div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {order.sanPhams?.length || 0} sản phẩm
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>TỔNG TIỀN</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0ea5e9' }}>{fmt(order.tongTien)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelected(order)}
                      style={{
                        padding: '8px 20px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontWeight: 600, cursor: 'pointer', fontSize: '13px',
                      }}
                    >
                      <i className="fas fa-eye me-1" />Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      {selected && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '18px' }}>
                  Chi tiết đơn hàng #{selected.maHD}
                </h3>
                <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  {fmtDate(selected.ngayTao)}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Thông tin */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>THÔNG TIN GIAO HÀNG</div>
                  {[
                    { label: 'Họ tên', value: selected.hoTen },
                    { label: 'SĐT', value: selected.soDienThoai },
                    { label: 'Email', value: selected.email },
                    { label: 'Địa chỉ', value: selected.diaChi },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '14px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '60px' }}>{row.label}:</span>
                      <span style={{ color: '#374151', fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, marginBottom: '10px' }}>THÔNG TIN ĐƠN HÀNG</div>
                  {[
                    { label: 'Mã ĐH', value: `#${selected.maHD}` },
                    { label: 'Thanh toán', value: selected.phuongThucThanhToan },
                    { label: 'Trạng thái', value: selected.trangThai || 'Chờ xác nhận' },
                    { label: 'Ghi chú', value: selected.ghiChu || '—' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '14px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '70px' }}>{row.label}:</span>
                      <span style={{ color: '#374151', fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sản phẩm */}
              {selected.sanPhams && selected.sanPhams.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '12px', fontSize: '15px' }}>
                    <i className="fas fa-box me-2" style={{ color: '#0ea5e9' }} />Sản phẩm đã đặt
                  </div>
                  <div style={{ border: '1px solid #f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    {selected.sanPhams.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px',
                          borderBottom: i < selected.sanPhams.length - 1 ? '1px solid #f1f5f9' : 'none',
                          background: i % 2 === 0 ? 'white' : '#fafafa',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: '#374151' }}>{item.tenSP || `Sản phẩm #${item.maSP}`}</div>
                          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                            {item.soLuong} × {fmt(item.donGia)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: '#0ea5e9' }}>{fmt(item.thanhTien || item.soLuong * item.donGia)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tổng */}
              <div style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bae6fd' }}>
                <span style={{ fontWeight: 700, color: '#0369a1', fontSize: '15px' }}>Tổng thanh toán</span>
                <span style={{ fontWeight: 800, color: '#0ea5e9', fontSize: '22px' }}>{fmt(selected.tongTien)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
