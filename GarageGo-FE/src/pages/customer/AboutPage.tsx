import React from 'react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      position: 'Giám đốc kỹ thuật',
      experience: '15 năm kinh nghiệm',
      image: '/images/team-1.jpg',
      description: 'Chuyên gia về động cơ và hệ thống truyền động',
    },
    {
      name: 'Trần Thị B',
      position: 'Trưởng phòng dịch vụ',
      experience: '12 năm kinh nghiệm',
      image: '/images/team-2.jpg',
      description: 'Chuyên về tư vấn và chăm sóc khách hàng',
    },
    {
      name: 'Lê Văn C',
      position: 'Kỹ thuật viên trưởng',
      experience: '10 năm kinh nghiệm',
      image: '/images/team-3.jpg',
      description: 'Chuyên gia về hệ thống điện và điện tử ô tô',
    },
    {
      name: 'Phạm Thị D',
      position: 'Quản lý chất lượng',
      experience: '8 năm kinh nghiệm',
      image: '/images/team-4.jpg',
      description: 'Đảm bảo chất lượng dịch vụ và sản phẩm',
    },
  ];

  const achievements = [
    {
      icon: 'fas fa-award',
      title: 'Chứng nhận ISO 9001:2015',
      description: 'Hệ thống quản lý chất lượng quốc tế',
    },
    {
      icon: 'fas fa-medal',
      title: 'Top 10 Gara uy tín',
      description: 'Được bình chọn bởi khách hàng năm 2023',
    },
    {
      icon: 'fas fa-handshake',
      title: 'Đối tác chính thức',
      description: 'Của các hãng xe lớn tại Việt Nam',
    },
    {
      icon: 'fas fa-users',
      title: '1000+ Khách hàng',
      description: 'Tin tưởng và sử dụng dịch vụ thường xuyên',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Về MTProAuto</h1>
            <p className="text-xl opacity-90">
              Hơn 10 năm kinh nghiệm trong lĩnh vực bảo dưỡng và sửa chữa ô tô
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-gray-600 text-lg">
                MTProAuto được thành lập với sứ mệnh mang đến dịch vụ bảo dưỡng
                và sửa chữa ô tô chất lượng cao nhất cho khách hàng Việt Nam
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg mb-6">
                  <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-6xl text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Khởi đầu từ đam mê
                </h3>
                <p className="text-gray-600 mb-4">
                  Được thành lập vào năm 2013 bởi một nhóm kỹ sư có đam mê với ô
                  tô, MTProAuto bắt đầu như một gara nhỏ với chỉ 3 nhân viên và
                  quyết tâm mang đến dịch vụ tốt nhất cho khách hàng.
                </p>
                <p className="text-gray-600 mb-4">
                  Qua hơn 10 năm phát triển, chúng tôi đã trở thành một trong
                  những hệ thống gara uy tín nhất tại TP.HCM với đội ngũ hơn 50
                  kỹ thuật viên chuyên nghiệp và trang thiết bị hiện đại.
                </p>
                <p className="text-gray-600">
                  Chúng tôi tự hào đã phục vụ hơn 10,000 lượt khách hàng và duy
                  trì tỷ lệ hài lòng trên 98%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-bullseye text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sứ mệnh
                </h3>
                <p className="text-gray-600">
                  Mang đến cho khách hàng những dịch vụ bảo dưỡng và sửa chữa ô
                  tô chất lượng cao nhất với giá cả hợp lý, đội ngũ kỹ thuật
                  viên chuyên nghiệp và trang thiết bị hiện đại. Chúng tôi cam
                  kết đảm bảo an toàn và hiệu suất tối ưu cho chiếc xe của bạn.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <i className="fas fa-eye text-2xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tầm nhìn
                </h3>
                <p className="text-gray-600">
                  Trở thành hệ thống gara ô tô hàng đầu Việt Nam, được khách
                  hàng tin tưởng và lựa chọn số 1. Chúng tôi hướng tới việc mở
                  rộng mạng lưới trên toàn quốc và áp dụng công nghệ 4.0 vào quy
                  trình quản lý và dịch vụ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-gray-600 text-lg">
                Những giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chất lượng
                </h3>
                <p className="text-gray-600 text-sm">
                  Cam kết mang đến dịch vụ và sản phẩm chất lượng cao nhất
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-2xl text-green-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tận tâm
                </h3>
                <p className="text-gray-600 text-sm">
                  Phục vụ khách hàng với sự tận tâm và chu đáo nhất
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-2xl text-yellow-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sáng tạo
                </h3>
                <p className="text-gray-600 text-sm">
                  Không ngừng đổi mới và cải tiến quy trình dịch vụ
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-handshake text-2xl text-purple-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Uy tín
                </h3>
                <p className="text-gray-600 text-sm">
                  Xây dựng lòng tin với khách hàng qua từng dịch vụ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Đội ngũ chuyên gia
              </h2>
              <p className="text-gray-600 text-lg">
                Những con người tài năng và tận tâm tạo nên thành công của
                MTProAuto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-user text-4xl text-gray-400"></i>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm mb-2">
                      {member.position}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {member.experience}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thành tựu & Chứng nhận
              </h2>
              <p className="text-gray-600 text-lg">
                Những ghi nhận và chứng nhận uy tín trong ngành
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i
                      className={`${achievement.icon} text-2xl text-white`}
                    ></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hãy để chúng tôi chăm sóc xe của bạn
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Liên hệ ngay để được tư vấn và báo giá miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0123456789"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              0123 456 789
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-envelope mr-2"></i>
              Gửi tin nhắn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
