"use client";

import { useLanguage } from "@/lib/i18n";

/**
 * 在服务端组件中渲染可翻译文案的轻量客户端组件。
 * 用法：<T k="ui.featuredWorks" />
 */
export function T({ k, className }: { k: string; className?: string }) {
  const { t } = useLanguage();
  return <span className={className}>{t(k)}</span>;
}
