import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { requestService } from '../../services/requestService';
import { ServiceRequest } from '../../types/request';
import toast from 'react-hot-toast';

const statusStyle = (s: string) => {
  switch (s) {
    case 'Mới':         return { bg: '#dbeafe', color: '#1d4ed8', icon: 'fa-star', canEdit: true };
    case 'Đang xử lý': return { bg: '#fef9c3', color: '#a16207', icon: 'fa-spinner', canEdit: false };
    case 'Hoàn thành': return { bg: '#dcfce7', color: '#15803d', icon: 'fa-check-circle', canEdit: false };
    case 'Hủy':        return { bg: '#fee2e2', color: '#b91c1c', icon: 'fa-times-circle', canEdit: false };
    default:           return { bg: '#f1f5f9', color: '#64748b', icon: 'fa-circle', canEdit: false };
  }
};

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '-';

const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export const ServiceRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRequest | null>(null);
  const [editForm, setEditForm] = useState({ diaChi: '', ghiChu: '', soDienThoai: '' });
  const [saving, setSaving] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const all = await requestService.getAll();
      // Lọc theo username của user hiện tại
      const mine = all.filter(
        (r: ServiceRequest) =>
          r.username === user?.username ||
          r.tenKhachHang === user?.username ||
          r.email === user?.email
      );
      setRequests(mine);
    } catch {
      toast.error('Lỗi khi tải lịch sử yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (req: ServiceRequest) => {
    setEditing(req);
    setEditForm({ diaChi: req.diaChi || '', ghiChu: req.ghiChu || '', soDienThoai: req.soDienThoai || '' });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await requestService.update(editing.maYeuCau, {
        maYeuCau: editing.maYeuCau,
        tenKhachHang: editing.tenKhachHang,
        soDienThoai: editForm.soDienThoai,
        email: editing.email,
        diaChi: editForm.diaChi,
        maDV: editing.maDV,
        trangThai: editing.trangThai,
        ghiChu: editForm.ghiChu,
      });
      toast.success('Cập nhật yêu cầu thành công');
      setEditing(null);
      loadRequests();
    } catch {
      toast.error('Lỗi khi cập nhật yêu cầu');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
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
              <i className="fas fa-clipboard-list me-2" style={{ color: '#0ea5e9' }} />
              Lịch sử đặt dịch vụ
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              {requests.length} yêu cầu dịch vụ
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={loadRequests}
              style={{ padding: '8px 16px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              <i className="fas fa-sync-alt me-1" />Làm mới
            </button>
            <a
              href="/customer/services"
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fas fa-plus" />Đặt lịch mới
            </a>
          </div>
        </div>

        {requests.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <i className="fas fa-calendar-times" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px', display: 'block' }} />
            <h3 style={{ color: '#64748b', marginBottom: '8px' }}>Chưa có yêu cầu dịch vụ nào</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Đặt lịch dịch vụ để chúng tôi phục vụ bạn!</p>
            <a
              href="/customer/services"
              style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
            >
              <i className="fas fa-calendar-check me-2" />Đặt lịch ngay
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {requests.map(req => {
              const st = statusStyle(req.trangThai);
              return (
                <div
                  key={req.maYeuCau}
                  style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}
                >
                  {/* Header */}
                  <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-wrench" style={{ color: 'white', fontSize: '14px' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '15px' }}>
                          {req.dichVu?.tenDichVu || `Dịch vụ #${req.maDV}`}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Yêu cầu #{req.maYeuCau} · {fmtDate(req.ngayYeuCau)}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: st.bg, color: st.color }}>
                        <i className={`fas ${st.icon} me-1`} />{req.trangThai}
                      </span>
                      {st.canEdit && (
                        <button
                          onClick={() => openEdit(req)}
                          style={{ padding: '5px 12px', background: '#f0f9ff', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          <i className="fas fa-edit me-1" />Sửa
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                    {[
                      { label: 'KHÁCH HÀNG', value: req.tenKhachHang },
                      { label: 'SỐ ĐIỆN THOẠI', value: req.soDienThoai },
                      { label: 'ĐỊA CHỈ', value: req.diaChi },
                      req.dichVu?.gia ? { label: 'GIÁ DỊCH VỤ', value: fmt(req.dichVu.gia) } : null,
                      req.ghiChu ? { label: 'GHI CHÚ', value: req.ghiChu } : null,
                    ].filter(Boolean).map((item: any) => (
                      <div key={item.label}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '3px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog sửa */}
      {editing && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setEditing(null)}
        >
          <div
            style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '17px' }}>
                <i className="fas fa-edit me-2" />Chỉnh sửa yêu cầu #{editing.maYeuCau}
              </h3>
              <button onClick={() => setEditing(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#fef9c3', borderRadius: '10px', fontSize: '13px', color: '#a16207' }}>
                <i className="fas fa-info-circle me-2" />
                Chỉ có thể chỉnh sửa khi yêu cầu ở trạng thái <strong>Mới</strong>
              </div>

              {[
                { label: 'Số điện thoại', key: 'soDienThoai', type: 'tel', placeholder: '0901234567' },
                { label: 'Địa chỉ', key: 'diaChi', type: 'textarea', placeholder: 'Nhập địa chỉ...' },
                { label: 'Ghi chú', key: 'ghiChu', type: 'textarea', placeholder: 'Mô tả vấn đề hoặc yêu cầu đặc biệt...' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      style={{ ...inputStyle, resize: 'none' }} rows={2}
                      value={(editForm as any)[field.key]}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  ) : (
                    <input
                      style={inputStyle} type={field.type}
                      value={(editForm as any)[field.key]}
                      onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => setEditing(null)}
                  style={{ flex: 1, padding: '11px', background: 'white', color: '#64748b', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave} disabled={saving}
                  style={{ flex: 2, padding: '11px', background: saving ? '#94a3b8' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Đang lưu...' : <><i className="fas fa-save me-2" />Lưu thay đổi</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
