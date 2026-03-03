import React from "react";
import { FaBolt, FaShieldAlt, FaLeaf } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      title: "Nhanh chóng",
      desc: "Quy trình ứng tuyển tối giản, nhận phản hồi từ nhà tuyển dụng chỉ trong vài ngày.",
      // Thu nhỏ icon từ w-6 h-6 xuống w-5 h-5
      icon: <FaBolt className="w-5 h-5 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Tin cậy",
      desc: "Tất cả thông tin công ty đều được xác thực nghiêm ngặt để đảm bảo an toàn cho bạn.",
      icon: <FaShieldAlt className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Gần gũi thiên nhiên",
      desc: "Ưu tiên những doanh nghiệp có không gian xanh và văn hóa bền vững cho nhân viên.",
      icon: <FaLeaf className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
    },
  ];

  return (
    /* CHỈNH CHIỀU CAO: Giảm py-10 xuống py-6 (hoặc py-4) để section ngắn lại */
    <section className="py-6 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {" "}
          {/* Giảm gap-12 xuống gap-8 */}
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* THU NHỎ ICON CONTAINER: 
                  Giảm w-16 h-16 xuống w-12 h-12. 
                  Giảm mb-6 xuống mb-3 để các phần sát nhau hơn. 
              */}
              <div
                className={`${item.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm border border-white`}
              >
                {item.icon}
              </div>

              {/* Giảm mb-4 xuống mb-2 cho tiêu đề */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-tight">
                {item.title}
              </h3>

              <p className="text-gray-500 text-xs leading-relaxed max-w-[250px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
