"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

interface ViewsCarouselProps {
  views: string[];
}

const AUTO_PLAY_INTERVAL = 6000;
const COOLDOWN_AFTER_MANUAL = 15000;
const TRANSITION_DURATION = 700;

export function ViewsCarousel({ views }: ViewsCarouselProps) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? views.length - 1 : i - 1));
  }, [views.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === views.length - 1 ? 0 : i + 1));
  }, [views.length]);

  // 手动操作：暂停自动播放，冷却后恢复
  const handleManualNav = useCallback(
    (fn: () => void) => {
      fn();
      setIsPaused(true);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, COOLDOWN_AFTER_MANUAL);
    },
    []
  );

  // 自动播放
  useEffect(() => {
    if (isPaused || views.length <= 1) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }
    autoPlayTimerRef.current = setInterval(() => {
      setIndex((i) => (i === views.length - 1 ? 0 : i + 1));
    }, AUTO_PLAY_INTERVAL);
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, views.length]);

  // 清理冷却定时器
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  // 空状态
  if (views.length === 0) {
    return (
      <section className="mb-12">
        <div className="relative w-full bg-white" style={{ aspectRatio: "16/9" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm tracking-wide">{t("ui.viewsEmpty")}</p>
          </div>
        </div>
      </section>
    );
  }

  const progress = ((index + 1) / views.length) * 100;

  return (
    <section className="mb-12">
      {/* 图片 + 左右箭头（箭头在容器外部两侧） */}
      <div className="relative flex items-center">
        {/* 左箭头 */}
        <button
          onClick={() => handleManualNav(goPrev)}
          aria-label="Previous view"
          className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* 图片容器 */}
        <div className="relative flex-1 overflow-hidden bg-white">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {views.map((src, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity"
                style={{
                  opacity: i === index ? 1 : 0,
                  transitionDuration: `${TRANSITION_DURATION}ms`,
                  pointerEvents: i === index ? "auto" : "none",
                }}
              >
                <Image
                  src={src}
                  alt={`View ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 右箭头 */}
        <button
          onClick={() => handleManualNav(goNext)}
          aria-label="Next view"
          className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* 进度条 + 计数器（图片容器下方） */}
      <div className="flex items-center gap-4 mt-4 px-14">
        <div className="flex-1 h-px bg-gray-300/50 relative">
          <div
            className="absolute left-0 top-0 h-full bg-gray-700 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 tabular-nums">
          {index + 1} / {views.length}
        </span>
      </div>
    </section>
  );
}
