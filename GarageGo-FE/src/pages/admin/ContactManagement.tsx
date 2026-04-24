import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import { Contact } from '../../types/contact';
import toast from 'react-hot-toast';

export const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, daXuLy: boolean) => {
    try {
      await contactService.updateContactStatus(id, !daXuLy);
      toast.success(
        !daXuLy ? 'Đã đánh dấu đã xử lý' : 'Đã đánh dấu chưa xử lý'
      );
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.soDienThoai.includes(searchTerm) ||
      (contact.chuDe &&
        contact.chuDe.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.noiDung.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'pending' && !contact.daXuLy) ||
      (filterStatus === 'done' && contact.daXuLy);

    return matchesSearch && matchesFilter;
  });

  const getAvatarColor = (id: number) => {
    const colors = ['2377FC', '22C55E', 'FF9F43', '7367F0', 'FF5200'];
    return colors[id % 5];
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .flex-wrap-box {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .gap14 {
          gap: 14px;
        }

        .gap10 {
          gap: 10px;
        }

        .mb-24 {
          margin-bottom: 24px;
        }

        .page-title h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .breadcrumbs {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
        }

        .breadcrumbs a {
          color: #0ea5e9;
          text-decoration: none;
        }

        .wg-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .text-tiny {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .wg-filter {
          flex: 1;
        }

        .search-box {
          position: relative;
          max-width: 300px;
        }

        .search-box i {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: #f8fafc;
        }

        .search-box input:focus {
          outline: none;
          border-color: #2377FC;
          background: white;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #E8F1FF !important;
          color: #2377FC !important;
        }

        .filter-btn:not(.active) {
          background: #f0f0f0;
          color: #333;
        }

        .filter-btn:hover:not(.active) {
          background: #e2e8f0;
        }

        .wg-table {
          overflow-x: auto;
        }

        .table {
          margin: 0;
        }

        .table th {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          padding: 16px;
        }

        .table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .product-item .image img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .product-item .name {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        .product-item .text-secondary {
          font-size: 12px;
          color: #64748b;
        }

        .badge-status {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .badge-status.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }

        .badge-status.warning {
          background: rgba(255, 159, 67, 0.1);
          color: #FF9F43;
        }

        .badge-status:hover {
          transform: scale(1.05);
        }

        .list-icon-function {
          display: flex;
          gap: 8px;
        }

        .list-icon-function .item {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .list-icon-function .eye {
          background: rgba(35, 119, 252, 0.1);
          color: #2377FC;
        }

        .list-icon-function .trash {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }

        .list-icon-function .item:hover {
          transform: scale(1.1);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-state i {
          font-size: 48px;
          color: #94a3b8;
          margin-bottom: 16px;
        }

        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 20px 0;
        }

        .wg-pagination {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 4px;
        }

        .wg-pagination li a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          text-decoration: none;
          color: #64748b;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .wg-pagination li a:hover,
        .wg-pagination li a.active {
          background: #2377FC;
          color: white;
          border-color: #2377FC;
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="flex-wrap-box gap14 mb-24">
        <div className="page-title">
          <h3>Liên hệ</h3>
          <ul className="breadcrumbs">
            <li>
              <a href="/admin/dashboard">Dashboard</a>
            </li>
            <li>
              <i className="fas fa-chevron-right"></i>
            </li>
            <li>Liên hệ</li>
          </ul>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-24">
        <div className="col-md-4">
          <div
            style={{
              background: 'linear-gradient(135deg, #2377FC 0%, #1a5fd4 100%)',
              borderRadius: '12px',
              padding: '20px 24px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}
              >
                Tổng liên hệ
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {contacts.length}
              </div>
              <div
                style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}
              >
                <i className="fas fa-envelope me-1"></i> Tất cả liên hệ
              </div>
            </div>
            <div
              style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="fas fa-inbox" style={{ fontSize: '22px' }}></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16a34a 100%)',
              borderRadius: '12px',
              padding: '20px 24px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}
              >
                Đã xử lý
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {contacts.filter(x => x.daXuLy).length}
              </div>
              <div
                style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}
              >
                <i className="fas fa-check-circle me-1"></i> Hoàn thành
              </div>
            </div>
            <div
              style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="fas fa-check-double"
                style={{ fontSize: '22px' }}
              ></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              background: 'linear-gradient(135deg, #FF9F43 0%, #e8890a 100%)',
              borderRadius: '12px',
              padding: '20px 24px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{ fontSize: '13px', opacity: 0.85, marginBottom: '6px' }}
              >
                Chưa xử lý
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>
                {contacts.filter(x => !x.daXuLy).length}
              </div>
              <div
                style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}
              >
                <i className="fas fa-clock me-1"></i> Đang chờ
              </div>
            </div>
            <div
              style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i
                className="fas fa-hourglass-half"
                style={{ fontSize: '22px' }}
              ></i>
            </div>
          </div>
        </div>
      </div>

      <div className="wg-box">
        <div
          className="flex-wrap-box gap10 mb-24"
          style={{ padding: '20px 20px 0' }}
        >
          <div className="wg-filter flex-grow">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm liên hệ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Chưa xử lý
            </button>
            <button
              className={`filter-btn ${filterStatus === 'done' ? 'active' : ''}`}
              onClick={() => setFilterStatus('done')}
            >
              Đã xử lý
            </button>
          </div>
        </div>

        <div className="wg-table table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Người gửi</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Chủ đề</th>
                <th>Nội dung</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <tr key={contact.maLienHe}>
                    <td>
                      <div className="product-item gap14">
                        <div className="image">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.hoTen)}&background=${getAvatarColor(contact.maLienHe)}&color=fff&size=50`}
                            alt=""
                          />
                        </div>
                        <div className="flex flex-column">
                          <span className="name">{contact.hoTen}</span>
                        </div>
                      </div>
                    </td>
                    <td>{contact.soDienThoai}</td>
                    <td>{contact.email}</td>
                    <td>
                      <span className="fw-semibold">
                        {contact.chuDe || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary" title={contact.noiDung}>
                        {contact.noiDung.length > 40
                          ? contact.noiDung.substring(0, 40) + '...'
                          : contact.noiDung}
                      </span>
                    </td>
                    <td>
                      {new Date(contact.ngayGui).toLocaleDateString('vi-VN')}
                    </td>
                    <td>
                      <span
                        className={`badge-status ${contact.daXuLy ? 'success' : 'warning'}`}
                        onClick={() =>
                          handleStatusUpdate(contact.maLienHe, contact.daXuLy)
                        }
                      >
                        <i
                          className={`fas ${contact.daXuLy ? 'fa-check-circle' : 'fa-clock'} me-1`}
                        ></i>
                        {contact.daXuLy ? 'Đã xử lý' : 'Chưa xử lý'}
                      </span>
                    </td>
                    <td>
                      <div className="list-icon-function">
                        <a href="#" className="item eye" title="Xem chi tiết">
                          <i className="fas fa-eye"></i>
                        </a>
                        <a href="#" className="item trash" title="Xóa">
                          <i className="fas fa-trash-alt"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="empty-state">
                      <i className="fas fa-envelope fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Chưa có liên hệ nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="divider"></div>
        <div className="flex-wrap-box gap10" style={{ padding: '0 20px 20px' }}>
          <div className="text-tiny">
            Hiển thị {filteredContacts.length} liên hệ
          </div>
          <ul className="wg-pagination">
            <li>
              <a href="#">
                <i className="fas fa-chevron-left"></i>
              </a>
            </li>
            <li>
              <a href="#" className="active">
                1
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
