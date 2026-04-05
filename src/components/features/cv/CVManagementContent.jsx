
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaRegFilePdf,
  FaEllipsisV,
  FaPlus,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaStar,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { resumeService } from "@/services/resume.service";
import { getAccessToken } from "@/lib/apiClient/api.config";

// --- COMPONENT TOGGLE SWITCH 3D CUSTOM ---
const Custom3DToggle = ({ checked, onChange }) => {
  const size = 30;

  return (
    <div
      onClick={onChange}
      className="relative shrink-0 cursor-pointer select-none transition-all duration-300 active:scale-95"
      style={{
        "--size": `${size}px`,
        width: "calc(2.2 * var(--size))",
        height: "var(--size)",
        background: checked
          ? "linear-gradient(90deg, #6164ff, #474bff)"
          : "#d7d7d7",
        borderRadius: "var(--size)",
        perspective: "400px",
        boxShadow: checked
          ? "0 4px 12px rgba(71, 75, 255, 0.3)"
          : "inset 0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 3,
          width: "calc(.8 * var(--size))",
          height: "calc(.8 * var(--size))",
          top: "calc(.1 * var(--size))",
          left: checked ? "calc(1.3 * var(--size))" : "calc(.1 * var(--size))",
          background: "linear-gradient(45deg, #dedede, #ffffff)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          borderRadius: "50%",
          transition: "all .35s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      />
      <div className="relative w-full h-full pointer-events-none flex items-center">
        <span
          style={{
            position: "absolute",
            left: checked
              ? "calc(0.4 * var(--size))"
              : "calc(1.4 * var(--size))",
            color: checked ? "rgba(255,255,255,0.9)" : "#9b9b9b",
            fontFamily: '"Times New Roman", serif',
            fontSize: checked
              ? "calc(0.7 * var(--size))"
              : "calc(0.6 * var(--size))",
            fontWeight: "bold",
            transition: "all .35s ease-in-out",
            transform: checked ? "rotateY(0deg)" : "rotateY(180deg)",
            opacity: checked ? 1 : 0.8,
            lineHeight: 1,
            display: "block",
            textAlign: "center",
            width: "calc(0.5 * var(--size))",
          }}
        >
          {checked ? "●" : "· ·"}
        </span>
      </div>
    </div>
  );
};

const CVManagementContent = () => {
  // --- STATES QUẢN LÝ CV ---
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // --- STATE TRẠNG THÁI TÌM VIỆC ---
  const [isSearching, setIsSearching] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);

  // --- HÀM XỬ LÝ BẬT/TẮT VÀ GỌI TOAST ---
  const handleToggleSearching = () => {
    const newState = !isSearching;
    setIsSearching(newState);
    if (newState) {
      toast.success("Đã bật trạng thái tìm việc!");
    } else {
      toast("Đã tắt trạng thái tìm việc.", { icon: "⚠️" });
    }
  };

  const handleToggleSearchable = () => {
    const newState = !allowSearch;
    setAllowSearch(newState);
    if (newState) {
      toast.success("Đã cho phép NTD tìm kiếm hồ sơ!");
    } else {
      toast("Đã ẩn hồ sơ khỏi tìm kiếm.", { icon: "⚠️" });
    }
  };

  // --- LOGIC API CV ---
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        console.log('📡 Fetching resumes...');
        
        const token = getAccessToken();
        console.log('Token present:', !!token);
        
        const data = await resumeService.getResumes();
        console.log('📄 Raw resumes data:', data);
        
        // Transform data và chỉ lấy CV có status === 'active'
        if (data && Array.isArray(data)) {
          const formattedDocs = data
            .filter(doc => doc.status === 'active')  // Chỉ lấy CV active
            .map((doc) => ({
              id: doc.id,
              name: doc.name,
              updateAt: doc.updateAt,
              isDefault: doc.isDefault,
              url: doc.url,
              fileName: doc.fileName,
              status: doc.status
            }));
          
          console.log('Formatted active docs:', formattedDocs);
          setDocuments(formattedDocs);
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error("Lỗi fetch CV:", error);
        toast.error("Không thể tải danh sách CV");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumes();
  }, []);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      toast.error("Vui lòng chọn định dạng file PDF.");
      e.target.value = null;
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File quá lớn! Vui lòng chọn file dưới 10MB.");
      e.target.value = null;
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload file
      await resumeService.uploadResume(file);
      
      // Upload thành công, fetch lại danh sách CV mới
      toast.loading("Đang tải danh sách CV...", { id: "reload" });
      
      const data = await resumeService.getResumes();
      
      const formattedDocs = data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        updateAt: doc.updateAt,
        isDefault: doc.isDefault,
        url: doc.url,
        fileName: doc.fileName,
        status: doc.status
      }));
      
      setDocuments(formattedDocs);
      toast.dismiss("reload");
      toast.success("Tải lên CV thành công!");
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload thất bại. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleSetDefault = async (id) => {
    if (!id) {
      toast.error("ID CV không hợp lệ");
      return;
    }
    
    try {
      await resumeService.setDefaultResume(id);
      setDocuments((prev) =>
        prev.map((doc) => ({ ...doc, isDefault: doc.id === id }))
      );
      setActiveMenu(null);
      toast.success("Đã cập nhật CV mặc định!");
    } catch (error) {
      console.error("Set default error:", error);
      toast.error("Lỗi khi đặt CV mặc định.");
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("ID CV không hợp lệ");
      return;
    }
    
    if (window.confirm("Bạn có chắc chắn muốn xóa CV này?")) {
      try {
        await resumeService.deleteResume(id);
        setDocuments(documents.filter((doc) => doc.id !== id));
        setActiveMenu(null);
        toast.success("Đã xóa CV thành công!");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Xóa CV thất bại!");
      }
    }
  };

  const handlePreview = async (fileName) => {
    if (!fileName || fileName === 'undefined') {
      toast.error("Không thể xem trước CV: thiếu tên file");
      return;
    }
    
    try {
      toast.loading("Đang tải CV...", { id: "preview" });
      const { blob } = await resumeService.previewResume(fileName);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      toast.dismiss("preview");
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Không thể xem trước CV!", { id: "preview" });
    }
  };

  const handleDownload = async (fileName, displayName) => {
    if (!fileName || fileName === 'undefined') {
      toast.error("Không thể tải CV: thiếu tên file");
      return;
    }
    
    try {
      toast.loading("Đang tải CV...", { id: "download" });
      const { blob } = await resumeService.downloadResume(fileName);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = displayName || fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success("Tải CV thành công!", { id: "download" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Không thể tải CV!", { id: "download" });
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT CHÍNH (8 phần): DANH SÁCH CV */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <FaSpinner className="animate-spin text-[#00c853] text-4xl" />
            </div>
          ) : (
            <>
              <h3 className="font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
                <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>{" "}
                Kho CV của bạn
              </h3>

              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`relative flex items-center justify-between p-5 border-2 rounded-2xl transition-all ${doc.isDefault ? "border-[#00c853] bg-green-50/50 dark:bg-green-900/10" : "border-slate-100 dark:border-gray-800 hover:border-green-200"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${doc.isDefault ? "bg-[#00c853] text-white" : "bg-rose-50 text-rose-500"}`}
                        >
                          <FaRegFilePdf size={24} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                            {doc.name}
                          </p>
                          {doc.isDefault ? (
                            <span className="flex items-center gap-1 text-[10px] text-[#00c853] font-black uppercase tracking-widest mt-1">
                              <FaCheckCircle /> Đang mặc định
                            </span>
                          ) : (
                            <p className="text-xs text-slate-400 font-medium mt-1">
                              Cập nhật {doc.updateAt}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === doc.id ? null : doc.id)
                        }
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <FaEllipsisV />
                      </button>

                      {activeMenu === doc.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          ></div>
                          <div className="absolute right-6 top-16 w-48 bg-white dark:bg-[#252525] rounded-2xl shadow-2xl border border-slate-100 dark:border-gray-800 z-20 py-2 overflow-hidden animate-in zoom-in-95">
                            <button
                              onClick={() => {
                                handlePreview(doc.fileName);
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <FaEye size={14} /> Xem nhanh
                            </button>
                            <button
                              onClick={() => {
                                handleDownload(doc.fileName, doc.name);
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <FaDownload size={14} /> Tải xuống
                            </button>
                            {!doc.isDefault && (
                              <button
                                onClick={() => handleSetDefault(doc.id)}
                                className="w-full px-4 py-3 text-left text-xs font-black text-[#00c853] hover:bg-green-50 flex items-center gap-2 transition-colors"
                              >
                                <FaStar size={14} /> Đặt làm mặc định
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t dark:border-gray-800 mt-1 transition-colors"
                            >
                              <FaTrash size={14} /> Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 italic mb-4">
                      Chưa có CV nào trong hệ thống.
                    </p>
                    <p className="text-sm text-slate-500">
                      Hãy tải lên CV đầu tiên để AI phân tích và gợi ý việc làm phù hợp!
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full mt-8 py-4 border-2 border-dashed border-[#00c853]/30 bg-green-50/30 rounded-2xl text-[#00c853] text-sm font-black hover:bg-green-50 hover:border-[#00c853] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPlus />
                )}
                {isUploading ? "Đang tải file..." : "Tải lên CV mới"}
              </button>
            </>
          )}
        </div>

        {/* CỘT PHỤ (4 phần): TRẠNG THÁI */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white dark:bg-[#1e1e1e] p-7 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-black mb-8 flex items-center gap-2.5 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
              <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span> Cài
              đặt hồ sơ
            </h3>

            {/* Mục 1: Đang tìm việc */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4
                    className={`text-[17px] font-bold transition-colors ${isSearching ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                  >
                    Trạng thái tìm việc
                  </h4>
                  <p
                    className={`text-sm font-semibold mt-1 transition-colors ${isSearching ? "text-[#00c853]" : "text-gray-400"}`}
                  >
                    {isSearching ? "Đang Bật" : "Đang Tắt"}
                  </p>
                </div>
                <Custom3DToggle
                  checked={isSearching}
                  onChange={handleToggleSearching}
                />
              </div>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed text-justify bg-gray-50 dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                Bật tìm việc giúp hồ sơ nổi bật hơn và tăng 80% cơ hội Nhà tuyển
                dụng chủ động săn đón bạn.
              </p>
            </div>

            <hr className="border-gray-100 dark:border-gray-800 mb-8" />

            {/* Mục 2: Cho phép tìm kiếm hồ sơ */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4
                    className={`text-[17px] font-bold transition-colors ${allowSearch ? "text-[#00c853]" : "text-gray-500"}`}
                  >
                    Tìm kiếm hồ sơ
                  </h4>
                  <p
                    className={`text-sm font-semibold mt-1 transition-colors ${allowSearch ? "text-[#00c853]" : "text-gray-400"}`}
                  >
                    {allowSearch ? "Đang Mở công khai" : "Đang Khóa"}
                  </p>
                </div>
                <Custom3DToggle
                  checked={allowSearch}
                  onChange={handleToggleSearchable}
                />
              </div>

              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed text-justify mb-5">
                Các Nhà tuyển dụng uy tín có thể xem thông tin kỹ năng và kinh
                nghiệm trên CV mặc định của bạn.
              </p>

              {allowSearch && (
                <div className="space-y-3.5 bg-green-50/50 dark:bg-green-950/20 p-5 rounded-2xl border border-green-100 dark:border-green-900 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border border-[#00c853] flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-900 shadow-inner">
                      <FaCheck className="text-[#00c853] text-[9px]" />
                    </div>
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      Nhận <strong>Lời mời kết nối</strong> trực tiếp từ HR các
                      công ty lớn.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border border-[#00c853] flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-900 shadow-inner">
                      <FaCheck className="text-[#00c853] text-[9px]" />
                    </div>
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      Thông tin SĐT/Email được bảo mật tuyệt đối cho đến khi bạn
                      đồng ý.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner Tip AI */}
          <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900 flex gap-3 items-start">
            <FaInfoCircle
              className="text-amber-500 mt-0.5 shrink-0"
              size={16}
            />
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
              <strong>Mẹo:</strong> Hãy đặt CV tốt nhất làm mặc định để hệ thống
              AI OneClick gợi ý việc làm chính xác hơn.
            </p>
          </div>
        </div>
      </div>

      {/* POP-UP XEM NHANH PDF */}
      {previewUrl && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-5xl h-[92vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/20">
            <button
              onClick={() => {
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(null);
              }}
              className="absolute top-6 right-6 z-50 p-4 bg-slate-900/80 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
            >
              <FaTimes size={20} />
            </button>
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800">
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="CV Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagementContent;







// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   FaRegFilePdf,
//   FaEllipsisV,
//   FaPlus,
//   FaCheckCircle,
//   FaEye,
//   FaDownload,
//   FaStar,
//   FaTrash,
//   FaTimes,
//   FaSpinner,
//   FaCheck,
//   FaInfoCircle,
// } from "react-icons/fa";
// import toast from "react-hot-toast";
// import { resumeService } from "@/services/resume.service";

// // --- COMPONENT TOGGLE SWITCH 3D CUSTOM (DỰA TRÊN MẪU BẠN GỬI) ---
// const Custom3DToggle = ({ checked, onChange }) => {
//   const size = 30; // Kích thước cơ sở (tương đương --size: 30px)

//   return (
//     <div
//       onClick={onChange}
//       className="relative shrink-0 cursor-pointer select-none transition-all duration-300 active:scale-95"
//       style={{
//         "--size": `${size}px`,
//         width: "calc(2.2 * var(--size))",
//         height: "var(--size)",
//         background: checked
//           ? "linear-gradient(90deg, #6164ff, #474bff)"
//           : "#d7d7d7",
//         borderRadius: "var(--size)",
//         perspective: "400px",
//         boxShadow: checked
//           ? "0 4px 12px rgba(71, 75, 255, 0.3)"
//           : "inset 0 2px 4px rgba(0,0,0,0.1)",
//       }}
//     >
//       {/* Nút tròn di chuyển (Thẻ Input giả lập) */}
//       <div
//         style={{
//           position: "absolute",
//           zIndex: 3,
//           width: "calc(.8 * var(--size))",
//           height: "calc(.8 * var(--size))",
//           top: "calc(.1 * var(--size))",
//           left: checked ? "calc(1.3 * var(--size))" : "calc(.1 * var(--size))",
//           background: "linear-gradient(45deg, #dedede, #ffffff)",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//           borderRadius: "50%",
//           transition: "all .35s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
//         }}
//       />

//       {/* Biểu tượng xoay 3D (Pseudo-elements giả lập) */}
//       <div className="relative w-full h-full pointer-events-none flex items-center">
//         {/* Biểu tượng chấm tròn/hai chấm xoay */}
//         <span
//           style={{
//             position: "absolute",
//             left: checked
//               ? "calc(0.4 * var(--size))"
//               : "calc(1.4 * var(--size))",
//             color: checked ? "rgba(255,255,255,0.9)" : "#9b9b9b",
//             fontFamily: '"Times New Roman", serif',
//             fontSize: checked
//               ? "calc(0.7 * var(--size))"
//               : "calc(0.6 * var(--size))",
//             fontWeight: "bold",
//             transition: "all .35s ease-in-out",
//             transform: checked ? "rotateY(0deg)" : "rotateY(180deg)",
//             opacity: checked ? 1 : 0.8,
//             lineHeight: 1,
//             display: "block",
//             textAlign: "center",
//             width: "calc(0.5 * var(--size))",
//           }}
//         >
//           {checked ? "●" : "· ·"}
//         </span>
//       </div>
//     </div>
//   );
// };

// const CVManagementContent = () => {
//   // --- STATES QUẢN LÝ CV ---
//   const [documents, setDocuments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const fileInputRef = useRef(null);

//   // --- STATE TRẠNG THÁI TÌM VIỆC ---
//   const [isSearching, setIsSearching] = useState(true);
//   const [allowSearch, setAllowSearch] = useState(true);

//   // --- HÀM XỬ LÝ BẬT/TẮT VÀ GỌI TOAST ---
//   const handleToggleSearching = () => {
//     const newState = !isSearching;
//     setIsSearching(newState);
//     if (newState) {
//       toast.success("Đã bật trạng thái tìm việc!");
//     } else {
//       toast("Đã tắt trạng thái tìm việc.", { icon: "⚠️" });
//     }
//   };

//   const handleToggleSearchable = () => {
//     const newState = !allowSearch;
//     setAllowSearch(newState);
//     if (newState) {
//       toast.success("Đã cho phép NTD tìm kiếm hồ sơ!");
//     } else {
//       toast("Đã ẩn hồ sơ khỏi tìm kiếm.", { icon: "⚠️" });
//     }
//   };

//   // --- LOGIC API CV ---
//   useEffect(() => {
//     const fetchResumes = async () => {
//       try {
//         const data = await resumeService.getResumes();
//         setDocuments(data);
//       } catch (error) {
//         console.error("Lỗi:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchResumes();
//   }, []);

//   const handleUploadClick = () => fileInputRef.current.click();

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === "application/pdf") {
//       try {
//         setIsUploading(true);
//         const newDoc = await resumeService.uploadResume(file);
//         setDocuments([...documents, newDoc]);
//         toast.success("Tải lên CV thành công!");
//       } catch (error) {
//         toast.error("Upload thất bại. Vui lòng thử lại!");
//       } finally {
//         setIsUploading(false);
//         e.target.value = null;
//       }
//     } else if (file) {
//       toast.error("Vui lòng chọn định dạng file PDF.");
//     }
//   };

//   const handleSetDefault = async (id) => {
//     try {
//       await resumeService.setDefaultResume(id);
//       setDocuments((prev) =>
//         prev.map((doc) => ({ ...doc, isDefault: doc.id === id })),
//       );
//       setActiveMenu(null);
//       toast.success("Đã cập nhật CV mặc định!");
//     } catch (error) {
//       toast.error("Lỗi khi đặt mặc định.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Xóa tài liệu này?")) {
//       try {
//         await resumeService.deleteResume(id);
//         setDocuments(documents.filter((doc) => doc.id !== id));
//         setActiveMenu(null);
//         toast.success("Đã xóa CV thành công!");
//       } catch (error) {
//         toast.error("Xóa thất bại!");
//       }
//     }
//   };

//   return (
//     <div className="relative">
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//         {/* CỘT CHÍNH (8 phần): DANH SÁCH CV */}
//         <div className="lg:col-span-8 bg-white dark:bg-[#1e1e1e] p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
//           {isLoading ? (
//             <div className="flex justify-center py-20">
//               <FaSpinner className="animate-spin text-[#00c853] text-4xl" />
//             </div>
//           ) : (
//             <>
//               <h3 className="font-black mb-6 flex items-center gap-2 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
//                 <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span>{" "}
//                 Kho CV của bạn
//               </h3>

//               <div className="space-y-4">
//                 {documents.length > 0 ? (
//                   documents.map((doc) => (
//                     <div
//                       key={doc.id}
//                       className={`relative flex items-center justify-between p-5 border-2 rounded-2xl transition-all ${doc.isDefault ? "border-[#00c853] bg-green-50/50 dark:bg-green-900/10" : "border-slate-100 dark:border-gray-800 hover:border-green-200"}`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`p-3 rounded-xl ${doc.isDefault ? "bg-[#00c853] text-white" : "bg-rose-50 text-rose-500"}`}
//                         >
//                           <FaRegFilePdf size={24} />
//                         </div>
//                         <div>
//                           <p className="text-base font-bold text-slate-800 dark:text-slate-200">
//                             {doc.name}
//                           </p>
//                           {doc.isDefault ? (
//                             <span className="flex items-center gap-1 text-[10px] text-[#00c853] font-black uppercase tracking-widest mt-1">
//                               <FaCheckCircle /> Đang mặc định
//                             </span>
//                           ) : (
//                             <p className="text-xs text-slate-400 font-medium mt-1">
//                               Cập nhật {doc.updateAt}
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <button
//                         onClick={() =>
//                           setActiveMenu(activeMenu === doc.id ? null : doc.id)
//                         }
//                         className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors"
//                       >
//                         <FaEllipsisV />
//                       </button>

//                       {activeMenu === doc.id && (
//                         <>
//                           <div
//                             className="fixed inset-0 z-10"
//                             onClick={() => setActiveMenu(null)}
//                           ></div>
//                           <div className="absolute right-6 top-16 w-48 bg-white dark:bg-[#252525] rounded-2xl shadow-2xl border border-slate-100 dark:border-gray-800 z-20 py-2 overflow-hidden animate-in zoom-in-95">
//                             <button
//                               onClick={() => {
//                                 setPreviewUrl(doc.url);
//                                 setActiveMenu(null);
//                               }}
//                               className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2"
//                             >
//                               <FaEye /> Xem nhanh
//                             </button>
//                             <a
//                               href={doc.url}
//                               download
//                               className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-50 flex items-center gap-2"
//                             >
//                               <FaDownload /> Tải xuống
//                             </a>
//                             {!doc.isDefault && (
//                               <button
//                                 onClick={() => handleSetDefault(doc.id)}
//                                 className="w-full px-4 py-3 text-left text-xs font-black text-[#00c853] hover:bg-green-50 flex items-center gap-2"
//                               >
//                                 <FaStar /> Đặt làm mặc định
//                               </button>
//                             )}
//                             <button
//                               onClick={() => handleDelete(doc.id)}
//                               className="w-full px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t dark:border-gray-800 mt-1"
//                             >
//                               <FaTrash /> Xóa
//                             </button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-slate-400 italic py-10">
//                     Chưa có CV nào trong hệ thống.
//                   </p>
//                 )}
//               </div>

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept=".pdf"
//                 className="hidden"
//               />
//               <button
//                 onClick={handleUploadClick}
//                 disabled={isUploading}
//                 className="w-full mt-8 py-4 border-2 border-dashed border-[#00c853]/30 bg-green-50/30 rounded-2xl text-[#00c853] text-sm font-black hover:bg-green-50 hover:border-[#00c853] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
//               >
//                 {isUploading ? (
//                   <FaSpinner className="animate-spin" />
//                 ) : (
//                   <FaPlus />
//                 )}
//                 {isUploading ? "Đang tải file..." : "Tải lên CV mới"}
//               </button>
//             </>
//           )}
//         </div>

//         {/* CỘT PHỤ (4 phần): TRẠNG THÁI */}
//         <div className="lg:col-span-4 sticky top-24 space-y-6">
//           <div className="bg-white dark:bg-[#1e1e1e] p-7 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
//             <h3 className="font-black mb-8 flex items-center gap-2.5 text-gray-900 dark:text-white uppercase text-xs tracking-widest">
//               <span className="w-1.5 h-5 bg-[#00c853] rounded-full"></span> Cài
//               đặt hồ sơ
//             </h3>

//             {/* Mục 1: Đang tìm việc */}
//             <div className="mb-8">
//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <h4
//                     className={`text-[17px] font-bold transition-colors ${isSearching ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
//                   >
//                     Trạng thái tìm việc
//                   </h4>
//                   <p
//                     className={`text-sm font-semibold mt-1 transition-colors ${isSearching ? "text-[#00c853]" : "text-gray-400"}`}
//                   >
//                     {isSearching ? "Đang Bật" : "Đang Tắt"}
//                   </p>
//                 </div>
//                 {/* Gọi Custom Toggle 3D */}
//                 <Custom3DToggle
//                   checked={isSearching}
//                   onChange={handleToggleSearching}
//                 />
//               </div>
//               <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed text-justify bg-gray-50 dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
//                 Bật tìm việc giúp hồ sơ nổi bật hơn và tăng 80% cơ hội Nhà tuyển
//                 dụng chủ động săn đón bạn.
//               </p>
//             </div>

//             <hr className="border-gray-100 dark:border-gray-800 mb-8" />

//             {/* Mục 2: Cho phép tìm kiếm hồ sơ */}
//             <div>
//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <h4
//                     className={`text-[17px] font-bold transition-colors ${allowSearch ? "text-[#00c853]" : "text-gray-500"}`}
//                   >
//                     Tìm kiếm hồ sơ
//                   </h4>
//                   <p
//                     className={`text-sm font-semibold mt-1 transition-colors ${allowSearch ? "text-[#00c853]" : "text-gray-400"}`}
//                   >
//                     {allowSearch ? "Đang Mở công khai" : "Đang Khóa"}
//                   </p>
//                 </div>
//                 {/* Gọi Custom Toggle 3D */}
//                 <Custom3DToggle
//                   checked={allowSearch}
//                   onChange={handleToggleSearchable}
//                 />
//               </div>

//               <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed text-justify mb-5">
//                 Các Nhà tuyển dụng uy tín có thể xem thông tin kỹ năng và kinh
//                 nghiệm trên CV mặc định của bạn.
//               </p>

//               {/* List Lợi ích (Chỉ hiện khi bật) */}
//               {allowSearch && (
//                 <div className="space-y-3.5 bg-green-50/50 dark:bg-green-950/20 p-5 rounded-2xl border border-green-100 dark:border-green-900 animate-in fade-in zoom-in-95 duration-300">
//                   <div className="flex items-start gap-3">
//                     <div className="mt-0.5 w-5 h-5 rounded-full border border-[#00c853] flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-900 shadow-inner">
//                       <FaCheck className="text-[#00c853] text-[9px]" />
//                     </div>
//                     <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
//                       Nhận <strong>Lời mời kết nối</strong> trực tiếp từ HR các
//                       công ty lớn.
//                     </p>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="mt-0.5 w-5 h-5 rounded-full border border-[#00c853] flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-900 shadow-inner">
//                       <FaCheck className="text-[#00c853] text-[9px]" />
//                     </div>
//                     <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
//                       Thông tin SĐT/Email được bảo mật tuyệt đối cho đến khi bạn
//                       đồng ý.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Banner Tip AI */}
//           <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900 flex gap-3 items-start">
//             <FaInfoCircle
//               className="text-amber-500 mt-0.5 shrink-0"
//               size={16}
//             />
//             <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
//               <strong>Mẹo:</strong> Hãy đặt CV tốt nhất làm mặc định để hệ thống
//               AI OneClick gợi ý việc làm chính xác hơn.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* POP-UP XEM NHANH PDF */}
//       {previewUrl && (
//         <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-5xl h-[92vh] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-white/20">
//             <button
//               onClick={() => setPreviewUrl(null)}
//               className="absolute top-6 right-6 z-50 p-4 bg-slate-900/80 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
//             >
//               <FaTimes size={20} />
//             </button>
//             <div className="w-full h-full bg-gray-100 dark:bg-gray-800">
//               <iframe
//                 src={previewUrl}
//                 className="w-full h-full border-none"
//                 title="CV Preview"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CVManagementContent;
