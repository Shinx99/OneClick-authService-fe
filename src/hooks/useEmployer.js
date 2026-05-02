import { useState, useEffect, useCallback } from "react";
import employerService from "@/services/employer.service.js";
import toast, { ToastIcon } from "react-hot-toast";

export const useEmployer = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);


    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await employerService.fetchProfile();
            setProfile(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể tải thông tin hồ sơ");
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    return {
        profile,
        isLoading,
        error,
        refreshProfile: fetchProfile
    };
}