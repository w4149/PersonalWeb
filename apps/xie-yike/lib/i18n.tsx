"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "en" | "zh";

const STORAGE_KEY = "xie-yike-lang";
const DEFAULT_LANG: Language = "en";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * UI 文案翻译字典。
 * 动态内容（作品/项目描述等）的英文存放在数据模型的 *En 字段中，
 * 这里只放界面固定文案。
 */
const uiTranslations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "HOME",
    "nav.about": "ABOUT",
    "nav.exhibitions": "EXHIBITIONS",
    "nav.projects": "PROJECTS",
    "nav.otherWorks": "OTHER WORKS",
    "nav.news": "NEWS",
    "section.exhibitions": "EXHIBITIONS",
    "section.projects": "PROJECTS",
    "section.otherWorks": "OTHER WORKS",
    "section.news": "NEWS",
    "ui.readMoreExhibition": "Read More About This Exhibition",
    "ui.readMoreProject": "Read More About This Project",
    "ui.readLess": "Read Less",
    "ui.learnMore": "Learn More",
    "ui.detailsEmpty": "Details to be added",
    "ui.featuredWorks": "Featured Works",
    "ui.viewsEmpty": "Views to be added",
    "ui.artistRole": "Artist",
    "ui.homePlaceholder": "About placeholder. This section will introduce Xie Yike's artistic practice.",
    "ui.backToProjects": "\u2190 Back to Projects",
    "ui.backToExhibitions": "\u2190 Back to Exhibitions",
    "ui.newsComingSoon": "Coming soon. News and updates will be listed here.",
    "lang.en": "EN",
    "lang.zh": "中文",
  },
  zh: {
    "nav.home": "首页",
    "nav.about": "关于",
    "nav.exhibitions": "展览",
    "nav.projects": "项目",
    "nav.otherWorks": "其他作品",
    "nav.news": "动态",
    "section.exhibitions": "展览",
    "section.projects": "项目",
    "section.otherWorks": "其他作品",
    "section.news": "动态",
    "ui.readMoreExhibition": "了解更多关于这个展览",
    "ui.readMoreProject": "了解更多关于这个项目",
    "ui.readLess": "收起",
    "ui.learnMore": "了解更多",
    "ui.detailsEmpty": "详情待补充",
    "ui.featuredWorks": "精选作品",
    "ui.viewsEmpty": "现场图待补充",
    "ui.artistRole": "艺术家",
    "ui.homePlaceholder": "关于简介占位。此区块将介绍谢一可的艺术实践。",
    "ui.backToProjects": "\u2190 返回项目",
    "ui.backToExhibitions": "\u2190 返回展览",
    "ui.newsComingSoon": "即将上线。新闻与动态将在此处发布。",
    "lang.en": "EN",
    "lang.zh": "中文",
  },
};

function getInitialLang(): Language {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch {
    /* localStorage 不可用时回退默认 */
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* 忽略写入失败 */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "zh" : "en");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string) => {
      const dict = uiTranslations[lang] ?? uiTranslations[DEFAULT_LANG];
      return dict[key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
