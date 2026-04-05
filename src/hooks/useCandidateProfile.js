import { useState, useEffect, useCallback } from "react";
import candidateService from "@/services/candidate.service.js";
import toast, { ToastIcon } from "react-hot-toast";

export const useCandidateProfile = () => {

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);


    // Fetch data method
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await candidateService.fetchProfile();
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


    // Update profile method
    const updateProfile = async (payload) => {

        setIsUpdating(true);
        setError(null);

        try {
            const updatedProfile = await candidateService.updateProfile(payload);
            setProfile(updatedProfile);
            toast.success("Cập nhật hồ sơ thành công!");
            return { success: true, data: updatedProfile };
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật hồ sơ";
            setError(errMsg);
            toast.error(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setIsUpdating(false);
        }
    };


    // Update avatar
    const updateAvatar = async (file) => {
        setIsUpdating(true);
        try {
            const data = await candidateService.updateAvatar(file);
            setProfile(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
            toast.success("Cập nhật ảnh đại diện thành công!");
            return { success: true };
        } catch (err) {
            toast.error("Upload ảnh thất bại");
            return { success: false };
        } finally {
            setIsUpdating(false);
        }
    };


    // Update background
    const updateBackground = async (file) => {
        setIsUpdating(true);
        try {
            const data = await candidateService.updateBackground(file);
            setProfile(prev => ({ ...prev, backgroundUrl: data.backgroundUrl }));
            toast.success("Cập nhật ảnh bìa thành công!");
            return { success: true }
        } catch (err) {
            toast.error("Upload ảnh bìa thất bại");
            return { success: false };
        } finally {
            setIsUpdating(false);
        }
    }


    return {
        profile,
        isLoading,
        isUpdating,
        error,
        updateProfile,
        updateAvatar,
        updateBackground,
        refreshProfile: fetchProfile
    };
};