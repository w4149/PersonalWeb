"use client";

import type { ReactNode } from "react";
import {
  AutoLoadOriginalCtx,
  ShowViewOriginalCtx,
} from "@personal-sites/shared";

/**
 * 在项目页 / 展览页提供图片上下文：
 *  - AutoLoadOriginalCtx=true  → 预览先显，原图后台加载完成后 crossfade 无缝替换
 *  - ShowViewOriginalCtx=false → 不显示"查看原图"按钮（这些页面只做 blur-up，不需要灯箱按钮）
 *
 * 为什么单独抽成 Client Component：
 * Context Provider 必须在 Client Component 内渲染，再由 Server Component 引入。
 * 若 Server Component 直接写 `<XxxCtx.Provider>`，拿到的是 client-module 的桩引用，
 * `.Provider` 为 undefined，运行时报 "Element type is invalid"。
 */
export function DetailImageContext({ children }: { children: ReactNode }) {
  return (
    <AutoLoadOriginalCtx.Provider value={true}>
      <ShowViewOriginalCtx.Provider value={false}>
        {children}
      </ShowViewOriginalCtx.Provider>
    </AutoLoadOriginalCtx.Provider>
  );
}
