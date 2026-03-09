"use client";
import React from "react";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const JobForYou = () => {
  // BƯỚC 1: Dữ liệu mẫu (Sau này thay bằng: const [jobs, setJobs] = useState([]);)
  const mockJobs = [
    {
      id: 1,
      title: "Chuyên Viên Thiết Kế Nội Thất Phối Cảnh",
      company: "CÔNG TY CỔ PHẦN TẦM NHÌN QUỐC TẾ ALADIN",
      salary: "18 - 25 triệu",
      location: "Hà Nội",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: true,
      isFavorite: true,
    },
    {
      id: 2,
      title: "Chuyên Viên Kiểm Soát Sửa Chữa Bảo Dưỡng",
      company: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
      salary: "15 - 20 triệu",
      location: "Cần Thơ",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: false,
      isFavorite: false,
    },
    {
      id: 3,
      title: "Chuyên Viên Kiểm Soát Sửa Chữa Bảo Dưỡng",
      company: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
      salary: "15 - 20 triệu",
      location: "Cần Thơ",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: false,
      isFavorite: false,
    },
    {
      id: 4,
      title: "Chuyên Viên Kiểm Soát Sửa Chữa Bảo Dưỡng",
      company: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
      salary: "15 - 20 triệu",
      location: "Cần Thơ",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: false,
      isFavorite: false,
    },
    {
      id: 5,
      title: "Chuyên Viên Kiểm Soát Sửa Chữa Bảo Dưỡng",
      company: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
      salary: "15 - 20 triệu",
      location: "Cần Thơ",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: false,
      isFavorite: false,
    },
    {
      id: 6,
      title: "Chuyên Viên Kiểm Soát Sửa Chữa Bảo Dưỡng",
      company: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM",
      salary: "15 - 20 triệu",
      location: "Cần Thơ",
      logo: "https://static.topcv.vn/company_logos/cty-tnhh-the-gioi-canh-quan-xanh-3eb42c838e78547c1b9489026a326a80-64c2211fb4aba.jpg",
      isHot: false,
      isFavorite: false,
    },
  ];

  return (
    <section className="py-0">
      <div className="max-w-8xl mx-auto px-">
        {/* Tiêu đề phần */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-4">
            Việc làm dành cho bạn
          </h2>
          <button className="text-green-600 font-semibold hover:underline cursor-pointer">
            Xem tất cả
          </button>
        </div>

        {/* Lưới hiển thị danh sách - Tự động render theo số lượng phần tử */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10  cursor-pointer">
          {mockJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white p-4 rounded-xl shadow-sm border ${
                job.highlight ? "border-green-500" : "border-gray-100"
              } relative flex flex-col justify-between hover:shadow-md transition-all group h-full`}
            >
              {/* Thanh vạch trang trí nếu là job nổi bật */}
              {job.highlight && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"></div>
              )}

              <div className="flex gap-4">
                {/* Logo công ty */}
                <div className="w-16 h-16 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0 bg-white p-1">
                  <img
                    src={job.logo}
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thông tin chính */}
                <div className="flex-1 min-w-0">
                  {job.isHot && (
                    <span className="inline-block bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1.5">
                      ✦ NỔI BẬT
                    </span>
                  )}
                  <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 truncate mt-1 uppercase">
                    {job.company}
                  </p>
                </div>
              </div>

              {/* Chân thẻ: Lương & Địa điểm */}
              <div className="mt-5 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded font-semibold">
                    {job.salary}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded font-semibold">
                    {job.location}
                  </span>
                </div>

                <button className="text-green-500 cursor-pointer p-1 hover:bg-green-50 rounded-full transition-colors">
                  {job.isFavorite ? (
                    <FaHeart size={18} />
                  ) : (
                    <FaRegHeart size={18} className="text-green-300" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Phân trang tĩnh */}
        <div className="flex justify-center items-center gap-4">
          <button className="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all cursor-pointer">
            <FaChevronLeft size={12} />
          </button>
          <div className="text-sm font-medium text-gray-500">
            <span className="text-green-600 font-bold underline">1</span> / 10
            trang
          </div>
          <button className="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all cursor-pointer">
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobForYou;
