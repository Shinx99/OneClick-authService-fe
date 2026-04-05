"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaCamera, FaTimes, FaUpload } from "react-icons/fa";
import Link from "next/link";
import { useCandidateProfile } from "@/hooks/useCandidateProfile";


// -------------------------------------------------------------------------
// MODAL XEM / THAY ẢNH
// -------------------------------------------------------------------------
const ImageModal = ({ isOpen, onClose, imageUrl, title, onUpload, isUpdating }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-2xl w-[95vw] max-w-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-black text-gray-900 dark:text-white text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <FaTimes className="text-gray-600 dark:text-gray-400 w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ảnh full */}
        <div className="relative w-full aspect-video min-h-[400px] bg-gray-100 dark:bg-[#252525]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            unoptimized={imageUrl.startsWith("blob:")}
          />
          {isUpdating && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Footer — nút thay đổi ảnh */}
        <div className="px-6 py-5 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.
          </p>
          <button
            disabled={isUpdating}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00c853] hover:bg-[#00a846] text-white font-black rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FaUpload className="w-4 h-4" />
            {isUpdating ? "Đang tải lên..." : "Thay đổi ảnh"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onUpload(e.target.files[0]);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------------------
// PROFILE HEADER
// -------------------------------------------------------------------------
const ProfileHeader = () => {
  const { profile, updateProfile, updateAvatar, updateBackground, isUpdating } =
    useCandidateProfile();

  const [coverDragging, setCoverDragging] = useState(false);
  const [avatarDragging, setAvatarDragging] = useState(false);

  const [coverPreview, setCoverPreview] = useState("/images/cover-placeholder.jpg");
  const [avatarPreview, setAvatarPreview] = useState("/images/avatar-placeholder.jpg");

  const prevCoverRef = useRef(coverPreview);
  const prevAvatarRef = useRef(avatarPreview);

  //  Modal state
  const [modal, setModal] = useState({ open: false, type: null }); // type: "avatar" | "cover"

  // Sync từ server
  useEffect(() => {
    if (profile) {
      if (profile.backgroundUrl) {
        setCoverPreview(profile.backgroundUrl);
        prevCoverRef.current = profile.backgroundUrl;
      }
      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl);
        prevAvatarRef.current = profile.avatarUrl;
      }
    }
  }, [profile]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
      if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    };
  }, [coverPreview, avatarPreview]);

  // Upload ảnh bìa
  const handleCoverUpload = async (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    prevCoverRef.current = coverPreview;
    setCoverPreview(objectUrl);
    const result = await updateBackground(file);
    if (!result.success) setCoverPreview(prevCoverRef.current);
  };

  // Upload avatar
  const handleAvatarUpload = async (file) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    prevAvatarRef.current = avatarPreview;
    setAvatarPreview(objectUrl);
    const result = await updateAvatar(file);
    if (!result.success) setAvatarPreview(prevAvatarRef.current);
  };

  const handleCoverRemove = async () => {
    setCoverPreview("/images/cover-placeholder.jpg");
    await updateProfile({ backgroundUrl: null });
  };

  const displayFullName = profile
    ? `${profile.surname ?? ""} ${profile.name ?? ""}`.trim()
    : "Tên của bạn";
  const displayEmail = profile?.email || "Email";
  const displayLocation = profile?.province
    ? `${profile.commune ? profile.commune + ", " : ""}${profile.province}`
    : "Chưa cập nhật";

  return (
    <>
      {/*  Modal xem ảnh bìa */}
      <ImageModal
        isOpen={modal.open && modal.type === "cover"}
        onClose={() => setModal({ open: false, type: null })}
        imageUrl={coverPreview}
        title="Ảnh bìa"
        onUpload={handleCoverUpload}
        isUpdating={isUpdating}
      />

      {/*  Modal xem avatar */}
      <ImageModal
        isOpen={modal.open && modal.type === "avatar"}
        onClose={() => setModal({ open: false, type: null })}
        imageUrl={avatarPreview}
        title="Ảnh đại diện"
        onUpload={handleAvatarUpload}
        isUpdating={isUpdating}
      />

      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-gray-800 transition-all">
        {/* Cover Photo */}
        <div
          className={`h-48 md:h-56 lg:h-64 relative overflow-hidden rounded-t-3xl cursor-pointer transition-all group ${coverDragging ? "ring-4 ring-[#00c853]/50 scale-[1.01]" : ""} ${isUpdating ? "opacity-70 pointer-events-none" : ""}`}
          onClick={() => setModal({ open: true, type: "cover" })} // ✅ mở modal thay vì trigger input
          onDragOver={(e) => { e.preventDefault(); setCoverDragging(true); }}
          onDragLeave={() => setCoverDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setCoverDragging(false);
            handleCoverUpload(e.dataTransfer.files[0]);
          }}
        >
          <Image
            src={coverPreview}
            alt="Cover photo"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={coverPreview.startsWith("blob:")}
          />

          {isUpdating && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-between">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold text-gray-800">
              Xem / Thay ảnh bìa
            </div>
            {coverPreview !== "/images/cover-placeholder.jpg" && (
              <button
                onClick={(e) => { e.stopPropagation(); handleCoverRemove(); }}
                className="bg-red-500/90 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 backdrop-blur-sm transition-all"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Content Row */}
        <div className="px-8 md:px-12 pb-8 pt-4 md:pt-6 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
          {/* Avatar */}
          <div
            className={`relative w-28 h-28 lg:w-40 lg:h-40 xl:w-44 xl:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-white/50 cursor-pointer transition-all flex-shrink-0 ${avatarDragging ? "ring-[#00c853]/50 scale-105" : ""} ${isUpdating ? "opacity-70 pointer-events-none" : ""}`}
            onClick={() => setModal({ open: true, type: "avatar" })} // ✅ mở modal
            onDragOver={(e) => { e.preventDefault(); setAvatarDragging(true); }}
            onDragLeave={() => setAvatarDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setAvatarDragging(false);
              handleAvatarUpload(e.dataTransfer.files[0]);
            }}
          >
            <Image
              src={avatarPreview}
              alt="Avatar"
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              unoptimized={avatarPreview.startsWith("blob:")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end justify-end p-1.5 opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-[#00c853] p-1 rounded-full border-2 border-white">
                <FaCamera className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight">
              {displayFullName}
            </h1>
            <p className="text-[#00c853] font-bold text-lg md:text-xl">{displayEmail}</p>
            <div className="flex items-center text-gray-400 text-sm gap-2">
              <FaMapMarkerAlt />
              <span>{displayLocation}</span>
            </div>
          </div>

          {/* Edit Button */}
          <Link href="/profile/edit" className="whitespace-nowrap flex-shrink-0">
            <button className="bg-[#00c853] text-white px-6 md:px-8 py-3 rounded-full font-bold active:scale-95 shadow-lg hover:shadow-xl transition-all text-sm md:text-base">
              Chỉnh sửa hồ sơ
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;