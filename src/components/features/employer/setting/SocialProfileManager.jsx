"use client";
import React, { useState, useRef } from "react";
import {
  FaCamera,
  FaEdit,
  FaImage,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaMapMarkerAlt,
  FaBriefcase,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaGlobe,
  FaTimes,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PLATFORMS = {
  LinkedIn: {
    icon: FaLinkedin,
    color: "text-[#0A66C2]",
    bg: "bg-[#0A66C2]/10",
  },
  GitHub: {
    icon: FaGithub,
    color: "text-slate-800 dark:text-white",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  Portfolio: {
    icon: FaLink,
    color: "text-[#00c853]",
    bg: "bg-green-50 dark:bg-green-500/10",
  },
};

const SocialProfileManager = () => {
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [coverImg, setCoverImg] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dữ liệu Profile ban đầu
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    title: "Senior Tech Recruiter tại OneClick",
    location: "TP. Hồ Chí Minh",
    experience: "5 năm",
    about:
      "Chào bạn! Tôi chuyên kết nối các kỹ sư phần mềm tài năng với những dự án tuyệt vời tại OneClick.",
    links: [
      {
        id: 1,
        platform: "LinkedIn",
        url: "https://linkedin.com/in/nguyenvana",
      },
    ],
  });

  // State lưu tạm dữ liệu khi đang chỉnh sửa trong Modal
  const [editForm, setEditForm] = useState({ ...profile });

  // Xử lý Modal
  const openModal = () => {
    setEditForm({
      ...profile,
      links: JSON.parse(JSON.stringify(profile.links)),
    });
    setIsEditModalOpen(true);
  };
  const handleAddLink = () =>
    setEditForm({
      ...editForm,
      links: [
        ...editForm.links,
        { id: Date.now(), platform: "LinkedIn", url: "" },
      ],
    });
  const handleRemoveLink = (id) =>
    setEditForm({
      ...editForm,
      links: editForm.links.filter((l) => l.id !== id),
    });
  const handleLinkChange = (id, val) =>
    setEditForm({
      ...editForm,
      links: editForm.links.map((l) => (l.id === id ? { ...l, url: val } : l)),
    });
  const handlePlatformChange = (id, val) =>
    setEditForm({
      ...editForm,
      links: editForm.links.map((l) =>
        l.id === id ? { ...l, platform: val } : l,
      ),
    });
  const handleSave = () => {
    // Basic validation
    if (!editForm.name.trim() || !editForm.title.trim()) {
      toast.error("Vui lòng không để trống Tên và Chức danh!");
      return;
    }
    setProfile(editForm);
    setIsEditModalOpen(false);
    toast.success("Đã cập nhật Profile!");
  };

  // Mock Posts
  const posts = [
    {
      id: 1,
      author: profile.name, // Lấy tên thật từ profile
      title: profile.title, // Lấy chức danh từ profile
      time: "2 giờ trước",
      content:
        "🔥 GÓC TUYỂN DỤNG 🔥\nTeam mình đang tìm kiếm Senior Backend Engineer gia nhập. Mức lương up to $2500, cấp sẵn Mac Studio. Inb mình để nhận JD nhé!",
      likes: 45,
      comments: 12,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 1. HERO SECTION */}
      <div className="bg-card-bg rounded-[2.5rem] border-2 border-card-border overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 group/cover">
          {coverImg ? (
            <img
              src={URL.createObjectURL(coverImg)}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90" />
          )}
          <button
            onClick={() => coverInputRef.current.click()}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/40 text-white text-[12px] font-bold rounded-xl hover:bg-black/60 transition-all opacity-0 group-hover/cover:opacity-100"
          >
            <FaCamera /> Đổi ảnh bìa
          </button>
          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => setCoverImg(e.target.files[0])}
          />
        </div>

        <div className="px-6 sm:px-10 pb-6 relative">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end -mt-16 sm:-mt-20 mb-4">
            {/* AVATAR */}
            <div
              className="relative group/avatar cursor-pointer z-10"
              onClick={() => avatarInputRef.current.click()}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border-4 border-card-bg shadow-xl flex items-center justify-center overflow-hidden text-indigo-600 font-bold text-5xl">
                {avatarImg ? (
                  <img
                    src={URL.createObjectURL(avatarImg)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-transparent">
                <FaCamera className="text-white text-2xl" />
              </div>
              <input
                type="file"
                ref={avatarInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => setAvatarImg(e.target.files[0])}
              />
            </div>

            <div className="flex-1 w-full pb-2 mt-4 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">
                {profile.name}
              </h1>
              <p className="text-[15px] text-text-main font-medium mt-1">
                {profile.title}
              </p>
              <p className="text-[13px] text-text-muted mt-1.5 flex items-center gap-1.5">
                <FaMapMarkerAlt /> {profile.location}
              </p>
            </div>

            <div className="pb-2 w-full sm:w-auto">
              <button
                onClick={openModal}
                className="w-full sm:w-auto px-6 py-2.5 bg-background border-2 border-card-border text-text-main text-[13px] font-bold rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
              >
                <FaEdit /> Tùy chỉnh hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: INTRO & LINKS */}
        <div className="space-y-6">
          <div className="bg-card-bg rounded-[2rem] border-2 border-card-border p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-text-main mb-4">
              Giới thiệu
            </h3>
            <p className="text-[13.5px] text-text-muted leading-relaxed whitespace-pre-line mb-6">
              {profile.about}
            </p>
            <div className="flex items-center gap-3 text-[13px] font-medium text-text-main pt-4 border-t-2 border-card-border">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <FaBriefcase />
              </div>
              <span>{profile.experience}</span> {/* Sửa lại hiển thị động */}
            </div>
          </div>

          <div className="bg-card-bg rounded-[2rem] border-2 border-card-border p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-text-main mb-4">
              Liên kết cá nhân
            </h3>
            <div className="space-y-3">
              {profile.links.map((link) => {
                const meta = PLATFORMS[link.platform] || PLATFORMS["Portfolio"];
                const Icon = meta.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-background border-2 border-card-border hover:border-indigo-300 transition-colors group/link"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0 transition-transform group-hover/link:scale-110`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-text-main">
                        {link.platform}
                      </p>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {link.url.replace("https://", "")}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: POSTS FEED */}
        {/* <div className="lg:col-span-2 space-y-6">
          <div className="bg-card-bg rounded-[2rem] border-2 border-card-border p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {avatarImg ? (
                  <img
                    src={URL.createObjectURL(avatarImg)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <button className="flex-1 bg-background hover:bg-slate-50 dark:hover:bg-slate-800/50 border-2 border-card-border rounded-full px-5 text-left text-[14px] text-text-muted transition-colors">
                Bạn muốn chia sẻ cơ hội việc làm nào hôm nay?
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-card-border px-2">
              <button className="flex items-center gap-2 text-[13px] font-bold text-text-muted hover:text-indigo-600 transition-colors">
                <FaImage className="text-green-500 text-lg" /> Thêm ảnh
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card-bg rounded-[2rem] border-2 border-card-border shadow-sm overflow-hidden"
            >
              <div className="p-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center overflow-hidden">
                  {avatarImg ? (
                    <img
                      src={URL.createObjectURL(avatarImg)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    post.author.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-text-main">
                    {post.author}
                  </h4>
                  <p className="text-[12px] text-text-muted">
                    {post.title} • {post.time}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-3">
                <p className="text-[14px] text-text-main leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>
              <div className="px-5 py-3">
                <div className="flex items-center justify-between text-[12px] text-text-muted border-b-2 border-card-border pb-3 mb-2">
                  <span className="flex items-center gap-1.5">
                    <FaThumbsUp className="text-blue-500" /> {post.likes}
                  </span>
                  <span>{post.comments} bình luận</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button className="flex-1 py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-text-muted hover:bg-background rounded-xl transition-colors">
                    <FaThumbsUp className="text-lg" /> Thích
                  </button>
                  <button className="flex-1 py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-text-muted hover:bg-background rounded-xl transition-colors">
                    <FaComment className="text-lg" /> Bình luận
                  </button>
                  <button className="flex-1 py-2 flex items-center justify-center gap-2 text-[13px] font-bold text-text-muted hover:bg-background rounded-xl transition-colors">
                    <FaShare className="text-lg" /> Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* MODAL TÙY CHỈNH HỒ SƠ ĐẦY ĐỦ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="bg-card-bg w-full max-w-2xl rounded-[2.5rem] border-2 border-card-border shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b-2 border-card-border flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-text-main">
                Tùy chỉnh thương hiệu cá nhân
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-text-muted hover:bg-background rounded-xl transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* --- THÊM PHẦN: THÔNG TIN CƠ BẢN --- */}
              <div>
                <h3 className="text-[12px] font-bold text-text-muted uppercase tracking-widest mb-4">
                  Thông tin hiển thị
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase mb-2">
                      Tên hiển thị
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase mb-2">
                      Chức danh
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase mb-2">
                      Khu vực làm việc
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase mb-2">
                      Thông tin kinh nghiệm
                    </label>
                    <input
                      type="text"
                      value={editForm.experience}
                      placeholder="VD: 5 năm kinh nghiệm"
                      onChange={(e) =>
                        setEditForm({ ...editForm, experience: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* --- PHẦN: GIỚI THIỆU --- */}
              <div className="pt-6 border-t-2 border-card-border">
                <label className="block text-[11px] font-bold text-text-muted uppercase mb-2">
                  Giới thiệu bản thân (Bio)
                </label>
                <textarea
                  rows="4"
                  value={editForm.about}
                  onChange={(e) =>
                    setEditForm({ ...editForm, about: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border-2 border-card-border rounded-xl text-[14px] focus:border-indigo-500 outline-none resize-none"
                ></textarea>
              </div>

              {/* --- PHẦN: MẠNG XÃ HỘI --- */}
              <div className="pt-6 border-t-2 border-card-border">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[11px] font-bold text-text-muted uppercase">
                    Liên kết mạng xã hội
                  </label>
                  <span className="text-[11px] bg-background px-2 py-1 rounded-lg border-2 border-card-border">
                    {editForm.links.length}/5 links
                  </span>
                </div>
                <div className="space-y-3">
                  {editForm.links.map((link) => (
                    <div
                      key={link.id}
                      className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 border-2 border-card-border rounded-2xl"
                    >
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          handlePlatformChange(link.id, e.target.value)
                        }
                        className="w-full sm:w-40 px-3 py-2.5 bg-white dark:bg-card-bg border-2 border-card-border rounded-xl text-[13px] font-bold focus:border-indigo-500 outline-none cursor-pointer"
                      >
                        {Object.keys(PLATFORMS).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <input
                        type="url"
                        placeholder="https://"
                        value={link.url}
                        onChange={(e) =>
                          handleLinkChange(link.id, e.target.value)
                        }
                        className="flex-1 w-full px-4 py-2.5 bg-white dark:bg-card-bg border-2 border-card-border rounded-xl text-[13px] focus:border-indigo-500 outline-none"
                      />
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-3 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  ))}
                  {editForm.links.length < 5 && (
                    <button
                      onClick={handleAddLink}
                      className="w-full py-4 border-2 border-dashed border-card-border hover:border-indigo-500 text-text-muted hover:text-indigo-600 bg-background hover:bg-indigo-50/50 rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
                    >
                      <FaPlus /> Thêm liên kết mới
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="px-8 py-6 border-t-2 border-card-border flex justify-end gap-3 shrink-0 bg-card-bg rounded-b-[2.5rem]">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2.5 bg-background border-2 border-card-border text-text-main text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-indigo-600 text-white text-[13px] font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20 active:scale-95"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialProfileManager;
