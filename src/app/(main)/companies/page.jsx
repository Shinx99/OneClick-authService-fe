import CompanyContent from "@/components/features/companies/CompanyContent";

export default async function CompaniesPage() {
  // DL mẫu
  const initialCompanies = [
    {
      id: 1,
      slug: "one-click",
      name: "One-Click Corporation",
      industry: "Công nghệ thông tin",
      location: "Hà Nội",
      size: "51 - 200 nhân viên",
      logo: "/images/one-click-logo.png",
      isTop: true,
    },
    {
      id: 2,
      slug: "ecofinance-group",
      name: "EcoFinance Group",
      industry: "Tài chính - Ngân hàng",
      location: "TP.HCM",
      size: "500+ nhân viên",
      logo: "/images/ecofinance-logo.png",
      isTop: false,
    },
    {
      id: 3,
      slug: "viethealth-care",
      name: "VietHealth Care",
      industry: "Y tế & Dược phẩm",
      location: "Đà Nẵng",
      size: "201 - 500 nhân viên",
      logo: "/images/health-logo.png",
      isTop: false,
    },
    {
      id: 4,
      slug: "greentech-solutions",
      name: "GreenTech Solutions",
      industry: "Công nghệ thông tin",
      location: "Hà Nội",
      size: "201 - 500 nhân viên",
      logo: "/images/greentech-logo.png",
      isTop: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 transition-colors duration-300">
      <CompanyContent initialCompanies={initialCompanies} />
    </div>
  );
}
