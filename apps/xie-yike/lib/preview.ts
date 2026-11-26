import manifest from "./preview-manifest.json";

/**
 * 尺寸验证过的「原图 → 合格预览」映射表（仅包含在 R2 上真实存在且比原图小的预览）。
 * 由 scripts/_tmp_verify_sizes.mjs 探测后写入 lib/preview-manifest.json。
 */
const previewMap = manifest as Record<string, string>;

/**
 * 返回某张原图的合格预览地址；若没有尺寸合格的预览，则返回原图地址本身。
 * 绝不返回一个不存在或比原图更大的"假预览"，因此永远不会裂图、不会反而变慢。
 *
 * - 服务端组件（首页等仅展示预览的场景）直接调用本函数取 src。
 * - 客户端 PreviewableImg 通过 setPreviewResolver 注入同一逻辑（见 components/preview-setup.tsx）。
 */
export function toPreview(url: string): string {
  if (!url) return url;
  return previewMap[url] ?? url;
}
