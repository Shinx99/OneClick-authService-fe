import React from "react";

const CallToAction = () => {
  return (
    <section className=" bg-white dark:bg-[#121212] transition-colors">
      <div className="max-w-9xl mx-auto bg-green-600 rounded-[30px] py-5 md:py-3 text-center text-white shadow-xl shadow-green-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3 leading-tight uppercase tracking-tight">
            Sẵn sàng để bắt đầu hành trình mới?
          </h2>

          <p className="text-sm md:text-base opacity-90 mb-8 max-w-lg mx-auto font-medium leading-relaxed">
            Tham gia cùng hơn 100,000 ứng viên đã tìm thấy công việc mơ ước qua
            One-Click.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button className="bg-white text-[#00c853] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-md active:scale-95">
              Đăng ký ứng tuyển ngay
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all cursor-pointer active:scale-95">
              Dành cho nhà tuyển dụng
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
