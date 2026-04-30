"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const SetupPopupContext = createContext(null);

/**
 * Context để dev có thể tắt/bật popup xác thực công ty (RestrictedWrapper)
 * từ nút trên TopNav mà không cần thay đổi localStorage.
 */
export const SetupPopupProvider = ({ children }) => {
  // null = chưa override (để RestrictedWrapper tự quyết định)
  // true = ép hiện popup (locked)
  // false = ép ẩn popup (unlocked - dev mode)
  const [devOverride, setDevOverride] = useState(null);

  const toggleDevOverride = useCallback(() => {
    setDevOverride((prev) => {
      if (prev === null || prev === true) return false; // tắt popup
      return null; // bật lại (để RestrictedWrapper tự quyết)
    });
  }, []);

  const isDevUnlocked = devOverride === false;

  return (
    <SetupPopupContext.Provider
      value={{ devOverride, isDevUnlocked, toggleDevOverride }}
    >
      {children}
    </SetupPopupContext.Provider>
  );
};

export const useSetupPopup = () => {
  const context = useContext(SetupPopupContext);
  if (!context)
    throw new Error("useSetupPopup phải dùng trong SetupPopupProvider");
  return context;
};
