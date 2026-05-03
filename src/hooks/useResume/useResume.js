import { useState, useEffect, useCallback } from "react";
import resumeService from "@/services/resume.service.js";
import toast from "react-hot-toast";

export const useResume = () => {
    const [resume, setResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);



    //Fetch data method
    const fetchResume = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await resumeService.fetchResume();
            setResume(data);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể tải thông tin CV");
        } finally {
            setIsLoading(false);
        }
    }, []);


    // useEffect method
    useEffect(() => {
        fetchResume();
    }, [fetchResume]);



    // Update resume method
    const updateResume = async (payload) => {

        setIsUpdating(true);
        setError(null);

        try {
            const updatedResume = await resumeService.updateResume(payload);
            setResume(updatedResume);
            return { success: true, data: updatedResume };
        } catch (err) {
            const errMsg = err?.response?.data?.message || "Lỗi khi cập nhật hồ sơ";
            setError(errMsg);
            toast.error(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setIsUpdating(false);
        }
    };



    // Update cover
    const updateCover = async (file) => {
        setIsUpdating(true);
        try {
            const data = await resumeService.updateCover(file);
            setResume(prev => ({ ...prev, imgUrl: data.imgUrl }));
            return { success: true, url: data.imgUrl };
        } catch {
            return { success: false };
        } finally {
            setIsUpdating(false);
        }
    };



    // Delete Cover
    const deleteCover = async () => {
        setIsUpdating(true);
        try {
            await resumeService.deleteCover();
            setResume(prev => ({ ...prev, imgUrl: null }));
            return { success: true };
        } catch {
            return { success: false };
        } finally {
            setIsUpdating(false);
        }
    }



    return {
        resume,
        isLoading,
        isUpdating,
        error,
        updateResume,
        updateCover,
        deleteCover,
        refreshResume: fetchResume
    }
};