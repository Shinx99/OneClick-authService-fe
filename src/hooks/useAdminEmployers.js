"use client";
import { useState, useEffect, useCallback } from "react";
import adminService from "@/services/admin.service";
import toast from "react-hot-toast";

export const useAdminEmployers = () => {
    const [employers, setEmployers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [status, setStatus] = useState("all");
    const [keyword, setKeyword] = useState("");

    const fetchEmployers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await adminService.getEmployers({
                page, size,
                status: status === "all" ? undefined : status,
                keyword,
            });
            setEmployers(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
        } catch (err) {
            toast.error("Không thể tải danh sách nhà tuyển dụng");
        } finally {
            setIsLoading(false);
        }
    }, [page, size, status, keyword]);

    useEffect(() => {
        fetchEmployers();
    }, [fetchEmployers]);

    return {
        employers, isLoading, page, totalPages, totalElements, status, keyword,
        changePage: setPage,
        changeStatus: (s) => { setStatus(s); setPage(0); },
        changeKeyword: (k) => { setKeyword(k); setPage(0); },
        refetch: fetchEmployers,
    };
};