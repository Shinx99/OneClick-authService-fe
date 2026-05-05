const getStatusConfig = (status) => {
    if (!status)
      return {
        label: "N/A",
        styles: "text-gray-500 bg-gray-500/5 border-gray-500/10",
      };

    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "OPEN":
      case "PUBLISHED":
        return {
          label: "Đang tuyển",
          styles: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
        };
      case "CLOSED":
      case "EXPIRED":
        return {
          label: "Đã đóng",
          styles: "text-red-500 bg-red-500/5 border-red-500/10",
        };
      case "PENDING":
        return {
          label: "Chờ duyệt",
          styles: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        };
      default:
        return {
          label: status,
          styles: "text-blue-500 bg-blue-500/5 border-blue-500/10",
        };
    }
  };
export default getStatusConfig;