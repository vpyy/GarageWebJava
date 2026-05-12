import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const STATUS: Record<
  string,
  { bg: string; color: string; icon: string; label: string }
> = {
  'Chờ xác nhận': {
    bg: '#fef9c3',
    color: '#a16207',
    icon: 'fa-clock',
    label: 'Chờ xác nhận',
  },
  'Đang xử lý': {
    bg: '#dbeafe',
    color: '#1d4ed8',
    icon: 'fa-spinner',
    label: 'Đang xử lý',
  },
  'Hoàn thành': {
    bg: '#dcfce7',
    color: '#15803d',
    icon: 'fa-check-circle',
    label: 'Hoàn thành',
  },
  Hủy: {
    bg: '#fee2e2',
    color: '#b91c1c',
    icon: 'fa-times-circle',
    label: 'Đã hủy',
  },
};

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );
const fmtDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState('all');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<Order[]>('/don-hang/my-orders');
      setOrders(data);
    } catch {
      try {
        const all = await apiService.get<Order[]>('/don-hang');
        setOrders(
          (all as Order[]).filter(
            (o: Order) => o.email === user?.email || o.email === user?.username
          )
        );
      } catch {
        toast.error('Lỗi khi tải đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered =
    filter === 'all'
      ? orders
      : orders.filter(o => (o.trangThai || 'Chờ xác nhận') === filter);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .ord-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 3.5rem 0 5rem; position: relative; overflow: hidden; }
        .ord-hero::before { content: ''; position: absolute; top: -30%; right: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%); }
        .ord-hero-inner { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; position: relative; }
        .ord-hero h1 { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 6px; }
        .ord-hero p { color: rgba(255,255,255,0.65); font-size: 14px; }

        .ord-body { max-width: 1000px; margin: -2.5rem auto 3rem; padding: 0 1.5rem; position: relative; z-index: 1; }

        .ord-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .ord-filter-btn { padding: 8px 16px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ord-filter-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }
        .ord-filter-btn.active { background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(14,165,233,0.3); }

        .ord-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 16px; transition: all 0.2s; }
        .ord-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); border-color: #e0f2fe; }
        .ord-card-head { padding: 14px 20px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .ord-id { font-weight: 800; color: #1e293b; font-size: 15px; }
        .ord-date { font-size: 12px; color: #94a3b8; }
        .ord-status { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .ord-card-body { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .ord-info-grid { display: flex; gap: 28px; flex-wrap: wrap; }
        .ord-info-item { }
        .ord-info-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .ord-info-val { font-size: 14px; color: #374151; font-weight: 600; }
        .ord-total { font-size: 20px; font-weight: 900; color: #0ea5e9; }
        .ord-detail-btn { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 10px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(14,165,233,0.25); }
        .ord-detail-btn:hover { transform: scale(1.03); }

        .ord-empty { background: white; border-radius: 20px; padding: 5rem 2rem; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

        /* Modal */
        .ord-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
        .ord-modal { background: white; border-radius: 24px; width: 100%; max-width: 680px; max-height: 90vh; overflow: auto; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
        .ord-modal-head { padding: 22px 26px; background: linear-gradient(135deg, #0f172a, #1e3a5f); border-radius: 24px 24px 0 0; display: flex; justify-content: space-between; align-items: center; }
        .ord-modal-close { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); border: none; color: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .ord-modal-close:hover { background: rgba(255,255,255,0.25); }
        .ord-modal-body { padding: 24px; }
        .ord-info-box { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .ord-info-box-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .ord-info-row { display: flex; gap: 8px; margin-bottom: 6px; font-size: 13px; }
        .ord-info-row-label { color: #94a3b8; min-width: 80px; }
        .ord-info-row-val { color: #374151; font-weight: 600; }
        .ord-item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .ord-item-row:last-child { border-bottom: none; }
        .ord-total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; border: 1px solid #bae6fd; }

        .ord-skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; height: 100px; margin-bottom: 16px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <div className="ord-hero">
        <div className="ord-hero-inner">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="fas fa-shopping-bag"
                style={{ color: 'white', fontSize: '18px' }}
              />
            </div>
            <div>
              <h1
                className="ord-hero h1"
                style={{
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                Lịch sử đơn hàng
              </h1>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                }}
              >
                {orders.length} đơn hàng
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="ord-body">
        {/* Filters */}
        <div className="ord-filters">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'Chờ xác nhận', label: 'Chờ xác nhận' },
            { key: 'Đang xử lý', label: 'Đang xử lý' },
            { key: 'Hoàn thành', label: 'Hoàn thành' },
            { key: 'Hủy', label: 'Đã hủy' },
          ].map(f => (
            <button
              key={f.key}
              className={`ord-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key !== 'all' && (
                <span
                  style={{
                    marginLeft: '6px',
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '11px',
                  }}
                >
                  {
                    orders.filter(
                      o => (o.trangThai || 'Chờ xác nhận') === f.key
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ord-skeleton" />
          ))
        ) : filtered.length === 0 ? (
          <div className="ord-empty">
            <i
              className="fas fa-shopping-bag"
              style={{
                fontSize: '3.5rem',
                color: '#cbd5e1',
                display: 'block',
                marginBottom: '1rem',
              }}
            />
            <h3
              style={{ color: '#374151', fontWeight: 700, marginBottom: '8px' }}
            >
              Chưa có đơn hàng
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Hãy mua sắm để tạo đơn hàng đầu tiên!
            </p>
            <Link
              to="/customer/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              <i className="fas fa-shopping-bag" />
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          filtered.map(order => {
            const st =
              STATUS[order.trangThai || 'Chờ xác nhận'] ||
              STATUS['Chờ xác nhận'];
            return (
              <div key={order.maHD} className="ord-card">
                <div className="ord-card-head">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span className="ord-id">Đơn #{order.maHD}</span>
                    <span className="ord-date">
                      <i className="fas fa-calendar me-1" />
                      {fmtDate(order.ngayTao)}
                    </span>
                  </div>
                  <span
                    className="ord-status"
                    style={{ background: st.bg, color: st.color }}
                  >
                    <i className={`fas ${st.icon}`} />
                    {st.label}
                  </span>
                </div>
                <div className="ord-card-body">
                  <div className="ord-info-grid">
                    <div className="ord-info-item">
                      <div className="ord-info-label">Khách hàng</div>
                      <div className="ord-info-val">{order.hoTen}</div>
                    </div>
                    <div className="ord-info-item">
                      <div className="ord-info-label">Thanh toán</div>
                      <div className="ord-info-val">
                        {order.phuongThucThanhToan === 'COD'
                          ? '💵 Tiền mặt'
                          : '🏦 Chuyển khoản'}
                      </div>
                    </div>
                    <div className="ord-info-item">
                      <div className="ord-info-label">Sản phẩm</div>
                      <div className="ord-info-val">
                        {order.sanPhams?.length || 0} sản phẩm
                      </div>
                    </div>
                    <div className="ord-info-item">
                      <div className="ord-info-label">Tổng tiền</div>
                      <div className="ord-total">{fmt(order.tongTien)}</div>
                    </div>
                  </div>
                  <button
                    className="ord-detail-btn"
                    onClick={() => setSelected(order)}
                  >
                    <i className="fas fa-eye" />
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="ord-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ord-modal" onClick={e => e.stopPropagation()}>
            <div className="ord-modal-head">
              <div>
                <div
                  style={{ color: 'white', fontWeight: 800, fontSize: '18px' }}
                >
                  Chi tiết đơn #{selected.maHD}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                    marginTop: '2px',
                  }}
                >
                  {fmtDate(selected.ngayTao)}
                </div>
              </div>
              <button
                className="ord-modal-close"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>
            <div className="ord-modal-body">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div className="ord-info-box">
                  <div className="ord-info-box-title">Thông tin giao hàng</div>
                  {[
                    ['Họ tên', selected.hoTen],
                    ['SĐT', selected.soDienThoai],
                    ['Email', selected.email],
                    ['Địa chỉ', selected.diaChi],
                  ].map(([l, v]) => (
                    <div key={l} className="ord-info-row">
                      <span className="ord-info-row-label">{l}:</span>
                      <span className="ord-info-row-val">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="ord-info-box">
                  <div className="ord-info-box-title">Thông tin đơn hàng</div>
                  {[
                    ['Mã ĐH', `#${selected.maHD}`],
                    ['Thanh toán', selected.phuongThucThanhToan],
                    ['Trạng thái', selected.trangThai || 'Chờ xác nhận'],
                    ['Ghi chú', selected.ghiChu || '—'],
                  ].map(([l, v]) => (
                    <div key={l} className="ord-info-row">
                      <span className="ord-info-row-label">{l}:</span>
                      <span className="ord-info-row-val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selected.sanPhams?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: '#1e293b',
                      marginBottom: '10px',
                      fontSize: '14px',
                    }}
                  >
                    <i
                      className="fas fa-box me-2"
                      style={{ color: '#0ea5e9' }}
                    />
                    Sản phẩm đã đặt
                  </div>
                  <div
                    style={{
                      border: '1px solid #f1f5f9',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    {selected.sanPhams.map((item, i) => (
                      <div
                        key={i}
                        className="ord-item-row"
                        style={{
                          padding: '12px 16px',
                          background: i % 2 === 0 ? 'white' : '#fafafa',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: '#374151',
                              fontSize: '14px',
                            }}
                          >
                            {item.tenSP || `SP #${item.maSP}`}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {item.soLuong} × {fmt(item.donGia)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: '#0ea5e9' }}>
                          {fmt(item.thanhTien || item.soLuong * item.donGia)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="ord-total-row">
                <span
                  style={{
                    fontWeight: 700,
                    color: '#0369a1',
                    fontSize: '15px',
                  }}
                >
                  Tổng thanh toán
                </span>
                <span
                  style={{
                    fontWeight: 900,
                    color: '#0ea5e9',
                    fontSize: '22px',
                  }}
                >
                  {fmt(selected.tongTien)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
