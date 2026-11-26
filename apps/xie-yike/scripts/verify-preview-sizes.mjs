/**
 * 尺寸验证：逐一 HEAD 探测 R2 上的「原图」与「命名推导出的预览图」，
 * 仅当预览图真实存在(200)、有大小、且严格小于原图时，才认定为合格预览。
 *
 * 为什么不只靠命名：R2 上可能存在"假预览"（文件存在但 ≥ 原图，甚至是陈旧的大文件），
 * 命名转换会误指向它们，反而拖慢速度。所以必须用 Content-Length 校验。
 *
 * 输出：
 *   - lib/preview-manifest.json        （代码导入的 source of truth：{ 原图URL: 预览URL }，仅合格项）
 *   - scripts/logs/preview-manifest-verified.json （同内容，留痕）
 *
 * 用法：node scripts/verify-preview-sizes.mjs
 */
import fs from "node:fs";
import path from "node:path";

const R2 = "https://pub-191526e40b2f4ebe994bafe555eeeeb7.r2.dev";
const ROOT = path.resolve("public/images");
const OUT_LIB = path.resolve("lib/preview-manifest.json");
const OUT_LOG = path.resolve("scripts/logs/preview-manifest-verified.json");
const CONCURRENCY = 8;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "preview") continue; // 跳过预览目录本身
      walk(p, out);
    } else if (/\.(jpe?g|png|webp)$/i.test(ent.name)) {
      out.push(p);
    }
  }
  return out;
}

function toRel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function previewUrlFor(rel) {
  const lastSlash = rel.lastIndexOf("/");
  const dir = lastSlash === -1 ? "" : rel.slice(0, lastSlash);
  const base = (lastSlash === -1 ? rel : rel.slice(lastSlash + 1)).replace(
    /\.[^.]+$/,
    ""
  );
  return `${R2}/images/${dir ? dir + "/" : ""}preview/${base}.webp`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function headSize(url) {
  // 网络抖动会偶发 ERR；重试几次，避免把好预览误判为缺失而踢出 manifest。
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) return { ok: false, status: res.status };
      const len = Number(res.headers.get("content-length"));
      return { ok: true, size: Number.isFinite(len) ? len : 0 };
    } catch {
      if (attempt < 2) await sleep(400 * (attempt + 1));
    }
  }
  return { ok: false, status: "ERR" };
}

const files = walk(ROOT);
console.log(`验证 ${files.length} 张原图（尺寸比对）...`);

const manifest = {};
const problems = { missing: [], notSmaller: [], origMissing: [] };
let done = 0;

async function worker(queue) {
  while (queue.length) {
    const rel = queue.shift();
    const origUrl = `${R2}/images/${rel}`;
    const prevUrl = previewUrlFor(rel);
    const [o, p] = await Promise.all([headSize(origUrl), headSize(prevUrl)]);
    if (!o.ok) problems.origMissing.push(`${rel} [${o.status}]`);
    else if (!p.ok) problems.missing.push(rel);
    else if (!(p.size > 0 && p.size < o.size))
      problems.notSmaller.push(`${rel}  orig=${o.size}B prev=${p.size}B`);
    else manifest[origUrl] = prevUrl;
    done++;
    if (done % 20 === 0) process.stdout.write(` ${done}/${files.length}`);
  }
}

const queue = files.map(toRel);
await Promise.all(
  Array.from({ length: CONCURRENCY }, () => worker(queue))
);
console.log(` ${done}/${files.length}\n`);

console.log("===== 汇总（共 " + files.length + "）=====");
console.log("  VALID 合格预览         :", Object.keys(manifest).length);
console.log("  PREV_MISSING 无预览    :", problems.missing.length);
console.log("  PREV_NOT_SMALLER 未更小:", problems.notSmaller.length);
console.log("  ORIG_MISSING 原图缺失  :", problems.origMissing.length);

if (problems.notSmaller.length) {
  console.log(
    "\n⚠️ 预览存在但不比原图小（命名欺骗/异常，不会切换）："
  );
  for (const x of problems.notSmaller) console.log("  " + x);
}
if (problems.origMissing.length) {
  console.log("\n⚠️ 原图在R2缺失：");
  for (const x of problems.origMissing) console.log("  " + x);
}
if (problems.missing.length) {
  console.log("\n⚠️ 无预览（回退原图）：");
  for (const x of problems.missing) console.log("  " + x);
}

fs.mkdirSync(path.dirname(OUT_LOG), { recursive: true });
fs.writeFileSync(OUT_LOG, JSON.stringify(manifest, null, 2));
fs.mkdirSync(path.dirname(OUT_LIB), { recursive: true });
fs.writeFileSync(OUT_LIB, JSON.stringify(manifest, null, 2));
console.log(
  `\n✅ 已写出合格清单：${path.relative(process.cwd(), OUT_LOG)}（${
    Object.keys(manifest).length
  } 项）`
);
console.log(
  `✅ 已同步到源码：${path.relative(process.cwd(), OUT_LIB)}（${
    Object.keys(manifest).length
  } 项）`
);
