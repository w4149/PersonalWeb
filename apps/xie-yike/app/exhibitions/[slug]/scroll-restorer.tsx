"use client";

import { useEffect, useRef } from "react";

const STORAGE_PREFIX = "exhibition-scroll:";

/**
 * 展览页滚动位置保存与恢复。
 * - 挂载时：从 sessionStorage 读取该展览的 scrollY 并恢复
 * - 滚动时：将 scrollY 存入 sessionStorage
 * 从作品详情页 Back 回来时，能回到之前浏览的位置。
 */
export function ScrollRestorer({ slug }: { slug: string }) {
  const key = `${STORAGE_PREFIX}${slug}`;
  const restoredRef = useRef(false);

  useEffect(() => {
    // 恢复滚动位置
    const saved = sessionStorage.getItem(key);
    if (saved && !restoredRef.current) {
      const y = parseInt(saved, 10);
      if (!isNaN(y)) {
        window.scrollTo(0, y);
        restoredRef.current = true;
      }
    }

    // 监听滚动并保存
    const onScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [key]);

  return null;
}
