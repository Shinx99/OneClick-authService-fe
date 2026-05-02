import { useState, useEffect, useCallback } from "react";
import resumeService from "@/services/resume.service.js";

export const useResumeByResumeId = (resumeId) => {
    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await resumeService.fetchResumeByResumeId({ resumeId });
            setResume(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể tải CV");
        } finally {
            setIsLoading(false);
        }
    }, [resumeId]);

    useEffect(() => {
        if (!resumeId) return;
        fetch();
    }, [fetch]);

    return { resume, isLoading, error };
}