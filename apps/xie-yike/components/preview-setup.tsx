"use client";

import { setPreviewResolver } from "@personal-sites/shared";
import { toPreview } from "@/lib/preview";

/**
 * 模块顶层副作用：把本站点尺寸验证过的 toPreview 注入共享组件的 toPreviewSrc。
 * 这样所有 <PreviewableImg>（作品详情页、画廊等）都会优先用合格预览，未命中则回退原图。
 *
 * 在根布局渲染 <PreviewSetup/> 即可：既触发服务端 SSR 时的注入，
 * 也确保该模块进入客户端 bundle，在客户端首次渲染前完成注入。
 */
setPreviewResolver(toPreview);

export function PreviewSetup() {
  return null;
}
