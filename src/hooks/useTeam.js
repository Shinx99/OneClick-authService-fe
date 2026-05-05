// hooks/useTeam.js
import { useState, useEffect, useCallback } from "react";
import employerService from "@/services/employer.service.js";

export const useTeam = () => {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false); // ← THIẾU CÁI NÀY
    const [error, setError] = useState(null);

    const fetchTeam = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await employerService.fetchTeam();
            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.response?.data?.message || "Không thể tải danh sách thành viên");
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const removeMember = useCallback(async (employerId) => {
        setIsRemoving(true);
        try {
            const data = await employerService.removeMember(employerId);
            if (!data.success) {
                throw new Error(data.message || "Xóa thất bại!");
            }
            setMembers((prev) => prev.filter((m) => m.employerId !== employerId));
            return data;
        } catch (err) {
            throw err;
        } finally {
            setIsRemoving(false);
        }
    }, []);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    return {
        members,
        isLoading,
        isRemoving,
        error,
        refreshTeam: fetchTeam,
        removeMember,
    };
};