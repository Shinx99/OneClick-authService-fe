import { useState, useEffect } from 'react';
import { savedJobService } from '@/services/savedJob.service';
import { useAuth } from '@/context/AuthContext'; // 1. Lấy trạng thái đăng nhập
import { toast } from 'react-hot-toast'; // 2. Lấy thư viện thông báo

export const useSavedJob = (jobId) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Mặc định là false cho nhẹ
  
  const { isAuthenticated } = useAuth(); 


  useEffect(() => {
    // NẾU CHƯA ĐĂNG NHẬP -> Dừng lại luôn, không gửi bất kỳ API nào hết!
    if (!jobId || !isAuthenticated) {
        setIsSaved(false);
        return;
    }
    
    const fetchSavedStatus = async () => {
      try {
        setIsLoading(true);
        const res = await savedJobService.checkSaved(jobId);
        if (res?.success) {
          setIsSaved(res.data.isSaved);
        } else {
          setIsSaved(false); 
        }
      } catch (error) {
        setIsSaved(false); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedStatus();
  }, [jobId, isAuthenticated]);

  // 2. KHI NGƯỜI DÙNG BẤM NÚT LƯU
  const toggleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu việc làm!", { duration: 3000, position: "top-right" });
      return;
    }

    // Nếu đã đăng nhập thì cho phép chạy 
    const previousState = isSaved;
    setIsSaved(!isSaved);

    try {
      if (previousState) {
        await savedJobService.unsaveJob(jobId);
      } else {
        await savedJobService.saveJob(jobId);
      }
    } catch (error) {
      setIsSaved(previousState);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!"); 
    }
  };

  return { isSaved, isLoading, toggleSaveJob };
};