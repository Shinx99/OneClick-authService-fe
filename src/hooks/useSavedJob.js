import { useState, useEffect } from 'react';
import { savedJobService } from '@/services/savedJob.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast'; 

export const useSavedJob = (jobId) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated } = useAuth(); 


  useEffect(() => {  
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

  const toggleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu việc làm!", { duration: 3000, position: "top-right" });
      return;
    }

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