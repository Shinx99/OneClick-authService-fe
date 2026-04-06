import React from "react";
import { FaBolt, FaShieldAlt, FaLeaf } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      title: "Nhanh chóng",
      icon: <FaBolt className="w-5 h-5 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Tin cậy",
      icon: <FaShieldAlt className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Gần gũi thiên nhiên",
      icon: <FaLeaf className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
    },
  ];

  return (
    <section className="py-12 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-sm border border-card-border bg-card-bg`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2 uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-text-muted text-xs leading-relaxed max-w-[250px]">
                Tất cả thông tin được xác thực nghiêm ngặt.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
