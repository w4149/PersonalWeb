"use client";

import { useLanguage } from "@/lib/i18n";

/**
 * 首页 ABOUT 区块的艺术家简介，根据当前语言渲染对应段落。
 * 文案来源：content/about/introduction.csv（由服务端 page.tsx 读取后传入）
 */
interface AboutIntroductionProps {
  zhParagraphs: string[];
  enParagraphs: string[];
}

export function AboutIntroduction({
  zhParagraphs,
  enParagraphs,
}: AboutIntroductionProps) {
  const { lang } = useLanguage();
  const paragraphs = lang === "zh" ? zhParagraphs : enParagraphs;

  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            "text-sm sm:text-base md:text-lg leading-relaxed text-gray-700" +
            (i < paragraphs.length - 1 ? " mb-6" : "")
          }
        >
          {p}
        </p>
      ))}
    </>
  );
}
