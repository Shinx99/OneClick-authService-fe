import React from "react";
import Image from "next/image";
import {
  FiClock,
  FiUsers,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import {
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineComputerDesktop,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";

const JobContent = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
      {/* ==========================================
          1. KHỐI HEADER JOB
      ========================================== */}
      <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 mb-8">
        {/* Logo Công ty */}
        <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl border border-gray-100 overflow-hidden relative bg-[#f1f8f5] flex items-center justify-center p-2">
          <Image
            src={data.logo}
            alt="Company Logo"
            fill
            className="object-contain p-3"
          />
        </div>

        {/* Thông tin chính */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-3">
            <h1 className="text-2xl md:text-[28px] font-extrabold text-gray-900 leading-tight">
              {data.title}
            </h1>
            <span className="bg-[#e8f5e9] text-green-600 text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap w-fit">
              {data.status}
            </span>
          </div>

          <p className="text-[15px] font-bold text-[#10B94F] mb-4 flex items-center gap-2">
            {data.company}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-[13px] text-gray-500 font-medium">
            <span className="flex items-center gap-1.5">
              <FiClock className="text-gray-400 text-lg" /> {data.postedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <FiUsers className="text-gray-400 text-lg" /> {data.applicants}{" "}
              ứng viên
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. MÔ TẢ CÔNG VIỆC
      ========================================== */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiFileText className="text-blue-500 text-xl" /> Mô tả công việc
        </h2>
        <div className="text-gray-600 text-[15px] leading-relaxed space-y-4">
          <p>
            Tại GreenEarth Solutions, chúng tôi đang tìm kiếm một Senior UX
            Designer tài năng để dẫn dắt việc thiết kế trải nghiệm người dùng
            cho các sản phẩm công nghệ xanh của chúng tôi. Bạn sẽ làm việc chặt
            chẽ với các nhà quản lý sản phẩm và kỹ sư để tạo ra các giải pháp
            trực quan, lấy người dùng làm trung tâm.
          </p>
          <ul className="list-disc pl-5 space-y-2.5 marker:text-gray-400">
            <li>
              Dẫn dắt quy trình thiết kế từ ý tưởng đến triển khai cuối cùng.
            </li>
            <li>
              Thực hiện nghiên cứu người dùng, phỏng vấn và thử nghiệm khả năng
              sử dụng.
            </li>
            <li>Tạo wireframes, prototypes và thiết kế giao diện chi tiết.</li>
            <li>
              Đảm bảo tính nhất quán của thiết kế trên các nền tảng web và
              mobile.
            </li>
            <li>
              Cộng tác với đội ngũ phát triển để đảm bảo chất lượng thiết kế
              được giữ nguyên khi code.
            </li>
          </ul>
        </div>
      </div>

      {/* ==========================================
          3. YÊU CẦU ỨNG VIÊN
      ========================================== */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiCheckCircle className="text-blue-500 text-xl" /> Yêu cầu ứng viên
        </h2>
        <ul className="list-disc pl-5 space-y-2.5 text-[15px] text-gray-600 leading-relaxed marker:text-gray-400">
          <li>
            Có ít nhất 5 năm kinh nghiệm làm việc trong lĩnh vực UI/UX Design.
          </li>
          <li>
            Thành thạo các công cụ thiết kế như{" "}
            <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
              Figma
            </span>
            , Sketch, Adobe XD.
          </li>
          <li>
            Có kinh nghiệm vững chắc về quy trình Design Thinking và Agile.
          </li>
          <li>
            Khả năng giao tiếp tốt và trình bày ý tưởng một cách thuyết phục.
          </li>
          <li>
            Portfolio ấn tượng thể hiện quy trình giải quyết vấn đề và tư duy
            thiết kế.
          </li>
          <li>
            Ưu tiên ứng viên có kinh nghiệm trong lĩnh vực công nghệ môi trường
            hoặc SaaS.
          </li>
        </ul>
      </div>

      {/* ==========================================
          4. QUYỀN LỢI (GRID 2x2) - ĐÃ CẬP NHẬT
      ========================================== */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <FiStar className="text-blue-500 text-xl" /> Quyền lợi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item 1 */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
            {/* Wrapper bọc Icon và Tiêu đề */}
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineCurrencyDollar className="text-blue-500 text-xl" />
              </div>
              <h4 className="font-bold text-gray-900 text-[14px]">
                Mức lương cạnh tranh
              </h4>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Lên đến $4000/tháng + Thưởng hiệu suất năm.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineShieldCheck className="text-blue-500 text-xl" />
              </div>
              <h4 className="font-bold text-gray-900 text-[14px]">
                Bảo hiểm toàn diện
              </h4>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Bảo hiểm sức khỏe cao cấp cho bạn và gia đình.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineComputerDesktop className="text-blue-500 text-xl" />
              </div>
              <h4 className="font-bold text-gray-900 text-[14px]">
                Thiết bị làm việc
              </h4>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Cung cấp MacBook Pro mới nhất và màn hình 4K.
            </p>
          </div>

          {/* Item 4 */}
          <div className="bg-[#f8fafc] p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <HiOutlineGlobeAlt className="text-blue-500 text-xl" />
              </div>
              <h4 className="font-bold text-gray-900 text-[14px]">
                Du lịch & Team building
              </h4>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Chuyến đi công ty hàng năm và các hoạt động nhóm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobContent;
