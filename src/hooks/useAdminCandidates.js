"use client";
import { useState, useEffect, useCallback } from "react";
import adminService from "@/services/admin.service";
import toast from "react-hot-toast";

export const useAdminCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState("all");
    const [keyword, setKeyword] = useState("");

    const fetchCandidates = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getCandidates({
                page,
                size,
                status: status === "all" ? undefined : status,
                keyword,
            });
            setCandidates(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
        } catch (err) {
            toast.error("Không thể tải danh sách ứng viên");
        } finally {
            setIsLoading(false);
        }
    }, [page, size, status, keyword]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    return {
        candidates,
        isLoading,
        page,
        totalPages,
        totalElements,
        status,
        keyword,
        changePage: setPage,
        changeStatus: (newStatus) => { setStatus(newStatus); setPage(0); },
        changeKeyword: (newKeyword) => { setKeyword(newKeyword); setPage(0); },
        refetch: fetchCandidates,
    };
};