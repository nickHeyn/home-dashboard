"use client";

import { useEffect, useState } from "react";
import * as quoteList from "@/lib/quotes/quotes.json";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

export default function QuotesPage() {
  const [quote, setQuote] = useState<(typeof quoteList)[0] | null | undefined>();

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    return quoteList[randomIndex];
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuote(getRandomQuote());
  }, []);

  return (
    <main className={`${cormorant.className} flex flex-col items-center justify-center h-screen`}>
      {!!quote && (
        <>
          <span className="text-3xl italic">&quot;{quote?.quote}&quot;</span>
          <span className="text-2xl">- {quote?.author}</span>
        </>
      )}
    </main>
  );
}
