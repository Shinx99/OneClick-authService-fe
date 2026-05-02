import { useState, useEffect, useCallback } from "react";
import resumeService from "@/services/resume.service.js";


export const useResumes = ({ keyword = "", page = 0, size = 9 } = {}) => {

    const [resumes, setResumes] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);



    // -----------------------------------------------------------------------
    // FETCH ALL RESUMES
    // -----------------------------------------------------------------------
    const fetchAllResumes = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await resumeService.fetchAllResumes({ keyword, page, size });
            setResumes(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể tải danh sách CV");
        } finally {
            setIsLoading(false);
        }
    }, [keyword, page, size]);



    // -----------------------------------------------------------------------
    // AUTO FETCH KHI keyword / page / size THAY ĐỔI
    // -----------------------------------------------------------------------
    useEffect(() => {
        fetchAllResumes();
    }, [fetchAllResumes]);



    // -----------------------------------------------------------------------
    // RETURN
    // -----------------------------------------------------------------------
    return {
        resumes,
        isLoading,
        error,
        refresh: fetchAllResumes
    };

}