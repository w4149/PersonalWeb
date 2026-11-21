"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

export function ExhibitionIntro({
  description,
  fullDescription,
  descriptionEn,
  fullDescriptionEn,
  variant = "exhibition",
}: {
  description: string;
  fullDescription?: string;
  descriptionEn?: string;
  fullDescriptionEn?: string;
  variant?: "exhibition" | "project";
}) {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const useEn = lang === "en" && descriptionEn;
  const activeDescription = useEn ? descriptionEn! : description;
  const activeFull = useEn
    ? fullDescriptionEn ?? fullDescription
    : fullDescription;

  // 按换行分段（单个换行即为段落分隔）
  const paragraphs = activeDescription.split(/\n+/).filter(Boolean);
  const fullParagraphs = activeFull
    ? activeFull.split(/\n+/).filter(Boolean)
    : [];
  const hasMore = fullParagraphs.length > 0;

  const readMoreKey =
    variant === "project" ? "ui.readMoreProject" : "ui.readMoreExhibition";

  return (
    <div>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-base sm:text-lg leading-relaxed text-gray-800 mb-6"
        >
          {p}
        </p>
      ))}

      {expanded &&
        fullParagraphs.map((p, i) => (
          <p
            key={`full-${i}`}
            className="text-base sm:text-lg leading-relaxed text-gray-800 mb-6"
          >
            {p}
          </p>
        ))}

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-900 border-b border-gray-400 hover:border-gray-900 pb-0.5 transition-colors"
        >
          {expanded ? t("ui.readLess") : t(readMoreKey)}
        </button>
      )}
    </div>
  );
}
