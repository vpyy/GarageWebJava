import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">GarageGo</h3>
                <p className="text-secondary-400 text-sm">
                  Gara ô tô chuyên nghiệp
                </p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              Chúng tôi cung cấp dịch vụ sửa chữa, bảo dưỡng ô tô chuyên nghiệp
              với đội ngũ kỹ thuật viên giàu kinh nghiệm và trang thiết bị hiện
              đại.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary-300 hover:text-white transition-colors text-sm"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Dịch vụ</h4>
            <ul className="space-y-2">
              <li className="text-secondary-300 text-sm">Bảo dưỡng định kỳ</li>
              <li className="text-secondary-300 text-sm">Sửa chữa động cơ</li>
              <li className="text-secondary-300 text-sm">Thay dầu máy</li>
              <li className="text-secondary-300 text-sm">Kiểm tra hệ thống</li>
              <li className="text-secondary-300 text-sm">
                Rửa xe chuyên nghiệp
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-secondary-300 text-sm">
                    123 Đường ABC, Quận XYZ
                    <br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">+84 123 456 789</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">info@garagego.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              © 2024 GarageGo. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors text-sm"
              >
                Chính sách bảo mật
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors text-sm"
              >
                Điều khoản sử dụng
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors text-sm"
              >
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
