const CompanyList = ({
  companies = [],
  totalPages,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="space-y-8">
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard key={company.companyId} company={company} />
          ))}
        </div>
      ) : (
        <div className="bg-card-bg p-12 rounded-[2rem] text-center border border-dashed border-card-border">
          <p className="text-gray-400 italic">Không tìm thấy công ty nào.</p>
        </div>
      )}

      {/* Phân trang thật từ API */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`w-10 h-10 rounded-xl font-black transition-all active:scale-90
                ${
                  currentPage === i
                    ? "bg-[#00c853] text-white shadow-lg"
                    : "bg-card-bg text-text-muted hover:text-[#00c853] border border-card-border"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
