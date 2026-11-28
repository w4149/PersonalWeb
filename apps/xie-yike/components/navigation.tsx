"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@personal-sites/shared";
import { useLanguage, type Language } from "@/lib/i18n";

const navItems = [
  { anchor: "#home", legacyPath: "/", labelKey: "nav.home" },
  { anchor: "#about", legacyPath: "/about", labelKey: "nav.about" },
  { anchor: "#exhibitions", legacyPath: "/exhibitions", labelKey: "nav.exhibitions" },
  { anchor: "#projects", legacyPath: "/projects", labelKey: "nav.projects" },
  // 暂时隐藏 Other Works（恢复时取消下方注释）
  // { anchor: "#other-works", legacyPath: "/other-works", labelKey: "nav.otherWorks" },
  { anchor: "#news", legacyPath: "/news", labelKey: "nav.news" },
];

function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  // 首页（/）为深色背景，语言切换文字用白色；其他页面背景为白，用黑色
  const isHome = pathname === "/";

  const langs: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
  ];

  return (
    <div className="flex items-center text-xs sm:text-sm tracking-wide">
      {langs.map((l, i) => (
        <span key={l.code} className="flex items-center">
          <button
            onClick={() => setLang(l.code)}
            className={cn(
              "transition-colors",
              lang === l.code
                ? isHome
                  ? "text-white font-medium"
                  : "text-black font-medium"
                : isHome
                ? "text-white/60 hover:text-white/80"
                : "text-black/60 hover:text-black/80"
            )}
            aria-label={`Switch to ${l.label}`}
          >
            {l.label}
          </button>
          {i < langs.length - 1 && (
            <span
              className={cn(
                "mx-1.5",
                isHome ? "text-white/40" : "text-black/40"
              )}
            >
              |
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hash = useHash();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
        <LanguageToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:text-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-20 sm:pt-20 px-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              let isActive = false;
              if (pathname === "/") {
                const currentHash = hash || "#home";
                isActive = currentHash === item.anchor;
              } else if (item.legacyPath === "/") {
                isActive = false;
              } else {
                isActive = pathname.startsWith(item.legacyPath);
              }

              return (
                <li key={item.anchor}>
                  <Link
                    href={`/${item.anchor}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block py-3 px-4 rounded-lg transition-colors text-base sm:text-sm font-medium tracking-wide",
                      isActive
                        ? "text-gray-900 bg-gray-200"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
