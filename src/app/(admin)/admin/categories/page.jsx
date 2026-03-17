import React from "react";
import CategoryContent from "@/components/features/admin/categories/CategoryContent";

export default async function CategoriesPage() {
  // Giả lập dữ liệu fetch từ Backend (Ngành nghề, Kỹ năng, Tỉnh thành)
  const initialData = {
    industries: [
      { id: "NN001", name: "Công nghệ thông tin" },
      { id: "NN002", name: "Kinh doanh & Marketing" },
      { id: "NN003", name: "Thiết kế đồ họa" },
      { id: "NN004", name: "Tư vấn Tài chính" },
      { id: "NN005", name: "Du lịch & Khách sạn" },
      { id: "NN006", name: "Y tế & Sức khỏe" },
    ],
    company_sizes: [
      { id: "QM001", name: "1 - 50 nhân viên" },
      { id: "QM002", name: "51 - 200 nhân viên" },
      { id: "QM003", name: "201 - 500 nhân viên" },
      { id: "QM004", name: "500+ nhân viên" },
    ],
    locations: [
      { id: "TT001", name: "Hà Nội" },
      { id: "TT002", name: "TP. Hồ Chí Minh" },
    ],
  };

  return <CategoryContent initialData={initialData} />;
}
