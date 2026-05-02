"use client";

import { Hero, Stats, SearchPrompt, CVMarket } from "@/components/features/cvMarket";
import { useState } from "react";
//import SearchPrompt from "@/components/features/cvMarket/searchPromt";

const HomePage = () => {

  const [keyword, setKeyword] = useState("");

  return (
    <main>
      {/* <Hero /> */}
      {/* <Stats /> */}
      <SearchPrompt onSearch={(kw) => setKeyword(kw)} />

      <CVMarket keyword={keyword} />
    </main>
  );
};

export default HomePage;