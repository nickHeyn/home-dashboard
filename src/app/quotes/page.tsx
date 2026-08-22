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

  const setRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quoteList.length);
    const newQuote = quoteList[randomIndex];
    setQuote(newQuote);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRandomQuote();
  }, []);

  return (
    <main
      className={`${cormorant.className} flex flex-col items-center justify-center h-screen text-center`}
      onClick={setRandomQuote}
    >
      {!!quote && (
        <>
          <span className="text-3xl italic">&quot;{quote?.quote}&quot;</span>
          <span className="text-2xl">- {quote?.author}</span>
        </>
      )}
    </main>
  );
}
