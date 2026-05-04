"use client";

import React, { useState } from "react";
import RestrictedWrapper from "@/components/features/employer/auth/RestrictedWrapper";
import { SearchPrompt, CVMarket } from "@/components/features/cvMarket";

export default function ResumeSearchPage() {
  const [keyword, setKeyword] = useState("");

  return (
    <RestrictedWrapper>
      <div className="space-y-6">
        <div>
          <SearchPrompt onSearch={(kw) => setKeyword(kw)} />
          <div className="mt-6">
            <CVMarket keyword={keyword} />
          </div>
        </div>
      </div>
    </RestrictedWrapper>
  );
}