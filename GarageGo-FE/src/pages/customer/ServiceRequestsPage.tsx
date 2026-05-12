import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { requestService } from '../../services/requestService';
import { ServiceRequest } from '../../types/request';
import toast from 'react-hot-toast';

const STATUS: Record<
  string,
  { bg: string; color: string; icon: string; canEdit: boolean }
> = {
  Mới: { bg: '#dbeafe', color: '#1d4ed8', icon: 'fa-star', canEdit: true },
  'Đang xử lý': {
    bg: '#fef9c3',
    color: '#a16207',
    icon: 'fa-spinner',
    canEdit: false,
  },
  'Hoàn thành': {
    bg: '#dcfce7',
    color: '#15803d',
    icon: 'fa-check-circle',
    canEdit: false,
  },
  Hủy: {
    bg: '#fee2e2',
    color: '#b91c1c',
    icon: 'fa-times-circle',
    canEdit: false,
  },
};

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
const fmt = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    n
  );

export const ServiceRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceRequest | null>(null);
  const [editForm, setEditForm] = useState({
    diaChi: '',
    ghiChu: '',
    soDienThoai: '',
  });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const all = await requestService.getAll();
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
    setEditForm({
      diaChi: req.diaChi || '',
      ghiChu: req.ghiChu || '',
      soDienThoai: req.soDienThoai || '',
    });
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
      toast.success('Cập nhật thành công!');
      setEditing(null);
      loadRequests();
    } catch {
      toast.error('Lỗi khi cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    filter === 'all' ? requests : requests.filter(r => r.trangThai === filter);

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .sr-hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%); padding: 3.5rem 0 5rem; position: relative; overflow: hidden; }
        .sr-hero::before { content: ''; position: absolute; top: -30%; left: -10%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%); }
        .sr-body { max-width: 1000px; margin: -2.5rem auto 3rem; padding: 0 1.5rem; position: relative; z-index: 1; }
        .sr-filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .sr-filter-btn { padding: 8px 16px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: white; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .sr-filter-btn:hover { border-color: #f59e0b; color: #f59e0b; }
        .sr-filter-btn.active { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(245,158,11,0.3); }

        .sr-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; overflow: hidden; margin-bottom: 16px; transition: all 0.2s; }
        .sr-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .sr-card-head { padding: 14px 20px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .sr-card-body { padding: 16px 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }
        .sr-field-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .sr-field-val { font-size: 14px; color: #374151; font-weight: 600; }
        .sr-status { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .sr-edit-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 8px; background: #f0f9ff; color: #0ea5e9; border: 1px solid #bae6fd; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .sr-edit-btn:hover { background: #0ea5e9; color: white; }

        .sr-empty { background: white; border-radius: 20px; padding: 5rem 2rem; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

        .sr-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(4px); }
        .sr-modal { background: white; border-radius: 24px; width: 100%; max-width: 500px; box-shadow: 0 24px 64px rgba(0,0,0,0.2); overflow: hidden; }
        .sr-modal-head { padding: 20px 24px; background: linear-gradient(135deg, #0ea5e9, #06b6d4); display: flex; justify-content: space-between; align-items: center; }
        .sr-modal-close { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; }
        .sr-modal-body { padding: 24px; }

        .sr-skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 16px; height: 100px; margin-bottom: 16px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <div className="sr-hero">
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 1.5rem',
            position: 'relative',
          }}
        >
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="fas fa-clipboard-list"
                style={{ color: 'white', fontSize: '18px' }}
              />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'white',
                }}
              >
                Lịch sử dịch vụ
              </h1>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px',
                }}
              >
                {requests.length} yêu cầu dịch vụ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-body">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div className="sr-filters">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'Mới', label: 'Mới' },
              { key: 'Đang xử lý', label: 'Đang xử lý' },
              { key: 'Hoàn thành', label: 'Hoàn thành' },
              { key: 'Hủy', label: 'Đã hủy' },
            ].map(f => (
              <button
                key={f.key}
                className={`sr-filter-btn ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Link
            to="/customer/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            <i className="fas fa-plus" />
            Đặt lịch mới
          </Link>
        </div>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="sr-skeleton" />
          ))
        ) : filtered.length === 0 ? (
          <div className="sr-empty">
            <i
              className="fas fa-calendar-times"
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
              Chưa có yêu cầu dịch vụ
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Đặt lịch dịch vụ để chúng tôi phục vụ bạn!
            </p>
            <Link
              to="/customer/services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              <i className="fas fa-calendar-check" />
              Đặt lịch ngay
            </Link>
          </div>
        ) : (
          filtered.map(req => {
            const st = STATUS[req.trangThai] || STATUS['Mới'];
            return (
              <div key={req.maYeuCau} className="sr-card">
                <div className="sr-card-head">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className="fas fa-wrench"
                        style={{ color: 'white', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: '#1e293b',
                          fontSize: '15px',
                        }}
                      >
                        {req.dichVu?.tenDichVu || `Dịch vụ #${req.maDV}`}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        #{req.maYeuCau} · {fmtDate(req.ngayYeuCau)}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      className="sr-status"
                      style={{ background: st.bg, color: st.color }}
                    >
                      <i className={`fas ${st.icon}`} />
                      {req.trangThai}
                    </span>
                    {st.canEdit && (
                      <button
                        className="sr-edit-btn"
                        onClick={() => openEdit(req)}
                      >
                        <i className="fas fa-edit" />
                        Sửa
                      </button>
                    )}
                  </div>
                </div>
                <div className="sr-card-body">
                  {[
                    { label: 'Khách hàng', val: req.tenKhachHang },
                    { label: 'Số điện thoại', val: req.soDienThoai },
                    { label: 'Địa chỉ', val: req.diaChi },
                    req.dichVu?.gia
                      ? { label: 'Giá dịch vụ', val: fmt(req.dichVu.gia) }
                      : null,
                    req.ghiChu ? { label: 'Ghi chú', val: req.ghiChu } : null,
                  ]
                    .filter(Boolean)
                    .map((f: any) => (
                      <div key={f.label}>
                        <div className="sr-field-label">{f.label}</div>
                        <div className="sr-field-val">{f.val || '—'}</div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="sr-modal-overlay" onClick={() => setEditing(null)}>
          <div className="sr-modal" onClick={e => e.stopPropagation()}>
            <div className="sr-modal-head">
              <div>
                <div
                  style={{ color: 'white', fontWeight: 800, fontSize: '17px' }}
                >
                  Chỉnh sửa yêu cầu #{editing.maYeuCau}
                </div>
                <div
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '12px',
                    marginTop: '2px',
                  }}
                >
                  Chỉ chỉnh sửa được khi trạng thái là "Mới"
                </div>
              </div>
              <button
                className="sr-modal-close"
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </div>
            <div className="sr-modal-body">
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 16px',
                  background: '#fffbeb',
                  borderRadius: '10px',
                  border: '1px solid #fde68a',
                  fontSize: '13px',
                  color: '#92400e',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <i
                  className="fas fa-info-circle"
                  style={{ color: '#f59e0b' }}
                />
                Chỉ có thể chỉnh sửa khi yêu cầu ở trạng thái{' '}
                <strong>Mới</strong>
              </div>
              {[
                {
                  label: 'Số điện thoại',
                  key: 'soDienThoai',
                  type: 'tel',
                  placeholder: '0901234567',
                },
                {
                  label: 'Địa chỉ',
                  key: 'diaChi',
                  type: 'textarea',
                  placeholder: 'Nhập địa chỉ...',
                },
                {
                  label: 'Ghi chú',
                  key: 'ghiChu',
                  type: 'textarea',
                  placeholder: 'Mô tả vấn đề...',
                },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      style={{ ...inp, resize: 'none' }}
                      rows={2}
                      value={(editForm as any)[f.key]}
                      onChange={e =>
                        setEditForm({ ...editForm, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  ) : (
                    <input
                      style={inp}
                      type={f.type}
                      value={(editForm as any)[f.key]}
                      onChange={e =>
                        setEditForm({ ...editForm, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder}
                      onFocus={e => (e.target.style.borderColor = '#0ea5e9')}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => setEditing(null)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: 'white',
                    color: '#64748b',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 2,
                    padding: '11px',
                    background: saving
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {saving ? (
                    'Đang lưu...'
                  ) : (
                    <>
                      <i className="fas fa-save me-2" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
