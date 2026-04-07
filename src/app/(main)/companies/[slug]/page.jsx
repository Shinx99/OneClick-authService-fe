import React from "react";
import CompanyBanner from "@/components/features/companies/detail/CompanyBanner";
import CompanyOverview from "@/components/features/companies/detail/CompanyOverview";
import CompanyContact from "@/components/features/companies/detail/CompanyContact";
import CompanyJobs from "@/components/features/companies/detail/CompanyJobs";
import CompanyReviews from "@/components/features/companies/detail/CompanyReviews";
import { notFound } from "next/navigation";

export default async function CompanyDetailPage({ params }) {
  const { slug } = await params;

  // DỮ LIỆU MẪU
  const companies = [
    {
      id: 1,
      slug: "one-click",
      name: "One-Click Corporation",
      industry: "Công nghệ & Phần mềm",
      slogan: "Kết nối nhân tài, kiến tạo tương lai xanh",
      logo: "/images/one-click-logo.png",
      cover: "/images/banner.png",
      website: "www.one-click.vn",
      size: "150 - 300 nhân viên",
      address: "Tòa nhà Green Plaza, Q. Cầu Giấy, Hà Nội",
      rating: "4.8",
      description:
        "Tại One-Click, chúng tôi tin rằng công nghệ không chỉ là những dòng code khô khan, mà là công cụ để tạo nên sự thay đổi tích cực cho cộng đồng. Với tầm nhìn trở thành nền tảng tuyển dụng thông minh hàng đầu Đông Nam Á, chúng tôi cam kết mang đến trải nghiệm tìm việc một chạm nhanh chóng, minh bạch và hiệu quả.",
      reviews: [
        {
          id: 1,
          author: "Nguyễn Anh Nam",
          role: "Senior Developer",
          content: "Môi trường sáng tạo và nhiều cây xanh...",
          stars: 5,
        },
        {
          id: 2,
          author: "Lê Thị Thu",
          role: "UX Designer",
          content: "Quy trình chuyên nghiệp, cơ hội học hỏi cao.",
          stars: 4,
        },
      ],
      jobs: [
        {
          id: 101,
          title: "Backend Engineer (Java/Spring Boot)",
          salary: "$1500 - $2500",
          time: "2 ngày trước",
        },
        {
          id: 102,
          title: "Next.js Frontend Developer",
          salary: "Thỏa thuận",
          time: "5 ngày trước",
        },
        {
          id: 103,
          title: "DevOps Engineer (Docker & K8s)",
          salary: "$2000 - $3500",
          time: "1 tuần trước",
        },
      ],
    },
    {
      id: 2,
      slug: "ecofinance-group",
      name: "EcoFinance Group",
      industry: "Tài chính - Ngân hàng",
      slogan: "Giải pháp tài chính bền vững cho tương lai",
      logo: "/images/one-click-logo.png",
      cover: "/images/banner.png",
      website: "www.ecofinance.group",
      size: "500+ nhân viên",
      address: "Tòa nhà Bitexco, Quận 1, TP. HCM",
      rating: "4.5",
      description:
        "EcoFinance Group là tập đoàn tài chính tiên phong trong việc áp dụng công nghệ xanh vào hệ thống ngân hàng số, giúp tối ưu hóa nguồn lực và bảo vệ môi trường toàn cầu.",
      reviews: [
        {
          id: 21,
          author: "Trần Minh Hoàng",
          role: "Accountant",
          content: "Chế độ đãi ngộ tốt, đồng nghiệp thân thiện.",
          stars: 5,
        },
      ],
      jobs: [
        {
          id: 201,
          title: "Trainee Banker",
          salary: "$800 - $1200",
          time: "1 tuần trước",
        },
        {
          id: 202,
          title: "Risk Management Analyst",
          salary: "Thỏa thuận",
          time: "3 ngày trước",
        },
      ],
    },
    {
      id: 3,
      slug: "viethealth-care",
      name: "VietHealth Care",
      industry: "Y tế & Dược phẩm",
      slogan: "Chăm sóc sức khỏe bằng cả trái tim",
      logo: "/images/one-click-logo.png",
      cover: "/images/banner.png",
      website: "www.viethealth.care",
      size: "201 - 500 nhân viên",
      address: "Khu Công nghệ cao, Hòa Lạc, Hà Nội",
      rating: "4.9",
      description:
        "VietHealth Care tập trung vào nghiên cứu và phát triển các thiết bị y tế thông minh, kết hợp AI để chẩn đoán sớm và nâng cao chất lượng sống cho người bệnh.",
      reviews: [
        {
          id: 31,
          author: "Phạm Đức Anh",
          role: "Researcher",
          content: "Công nghệ hiện đại, môi trường học thuật cao.",
          stars: 5,
        },
      ],
      jobs: [
        {
          id: 301,
          title: "Medical AI Researcher",
          salary: "$2500 - $4000",
          time: "Vừa xong",
        },
        {
          id: 302,
          title: "Dược sĩ lâm sàng",
          salary: "$1200 - $1800",
          time: "4 ngày trước",
        },
      ],
    },
    {
      id: 4,
      slug: "greentech-solutions",
      name: "GreenTech Solutions",
      industry: "Công nghệ thông tin",
      slogan: "Đột phá công nghệ, kiến tạo thế giới xanh",
      logo: "/images/one-click-logo.png",
      cover: "/images/banner.png",
      website: "www.greentech.solutions",
      size: "51 - 200 nhân viên",
      address: "Công viên phần mềm Quang Trung, Quận 12, TP. HCM",
      rating: "4.7",
      description:
        "GreenTech Solutions chuyên cung cấp các giải pháp phần mềm quản lý năng lượng và tối ưu hóa quy trình sản xuất cho các doanh nghiệp sản xuất bền vững.",
      reviews: [
        {
          id: 41,
          author: "Lê Văn Nam",
          role: "Developer",
          content: "Sếp tâm lý, dự án thú vị.",
          stars: 4,
        },
      ],
      jobs: [
        {
          id: 401,
          title: "Python Data Analyst",
          salary: "$1500 - $2200",
          time: "6 ngày trước",
        },
        {
          id: 402,
          title: "Embedded System Engineer",
          salary: "Thỏa thuận",
          time: "2 tuần trước",
        },
      ],
    },
  ];

  // Tìm kiếm công ty dựa trên slug
  const companyData = companies.find((c) => c.slug === slug);

  if (!companyData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TRUYỀN DỮ LIỆU QUA PROPS CHO CÁC SERVER COMPONENTS CON */}
        <CompanyBanner company={companyData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          {/* Cột trái: Chi tiết nội dung */}
          <div className="lg:col-span-2 space-y-8">
            <CompanyOverview description={companyData.description} />
            <CompanyReviews
              reviews={companyData.reviews}
              rating={companyData.rating}
            />
          </div>

          {/* Cột phải: Thông tin liên hệ & Việc làm */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-24 space-y-8">
              <CompanyContact contact={companyData} />
              <CompanyJobs jobs={companyData.jobs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
