/* =========================================================================
 * upload-previews-to-r2.mjs
 * 把本地 public/images/** /preview/*.webp 增量上传到 Cloudflare R2。
 *
 * - 纯 Node 实现 AWS SigV4，不依赖任何第三方包（不改 package.json）
 * - 凭证从环境变量读取，绝不写入代码：
 *     R2_ACCOUNT_ID       R2 账户 ID（Cloudflare 仪表盘 R2 概览页右上角）
 *     R2_ACCESS_KEY_ID    R2 API 令牌的 Access Key ID（S3 兼容）
 *     R2_SECRET_ACCESS_KEY 对应的 Secret
 * - 增量：先用公开 r2.dev 地址 HEAD 探测，已存在则跳过
 * - 目标 key 规则：images/<相对 public/images 的路径>，与站点 R2 引用一致
 *
 * 用法（PowerShell，单行内联凭证，不落地）：
 *   $env:R2_ACCOUNT_ID="xxx"; $env:R2_ACCESS_KEY_ID="xxx"; $env:R2_SECRET_ACCESS_KEY="xxx"; node scripts/upload-previews-to-r2.mjs
 * ========================================================================= */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const R2_PUBLIC = "https://pub-191526e40b2f4ebe994bafe555eeeeb7.r2.dev";
const BUCKET = "xieyike-website-images";
const ROOT = path.resolve("public/images");

const ACCOUNT = process.env.R2_ACCOUNT_ID;
const AKID = process.env.R2_ACCESS_KEY_ID;
const SECRET = process.env.R2_SECRET_ACCESS_KEY;

if (!ACCOUNT || !AKID || !SECRET) {
  console.error("[错误] 缺少环境变量：R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY");
  process.exit(1);
}

const S3_ENDPOINT = `https://${ACCOUNT}.r2.cloudflarestorage.com`;

// ---------- 收集本地 preview webp ----------
const files = []; // { abs, key, publicUrl }
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name.toLowerCase().endsWith(".webp")) {
      const rel = path.relative(ROOT, full).split(path.sep).join("/");
      files.push({
        abs: full,
        key: `images/${rel}`,
        publicUrl: `${R2_PUBLIC}/images/${rel}`,
        localSize: fs.statSync(full).size,
      });
    }
  }
}
walk(ROOT);
console.log(`找到本地 preview webp：${files.length} 张`);

// ---------- SigV4 ----------
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();
const sha256hex = (data) => crypto.createHash("sha256").update(data).digest("hex");

function signHeaders({ method, url, body, contentType, region = "auto", service = "s3" }) {
  const u = new URL(url);
  const host = u.host;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256hex(body);

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    method,
    encodeURI(u.pathname), // path-style，已含 /bucket/key
    "", // query string 为空
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${SECRET}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  return {
    host,
    "content-type": contentType,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    authorization: `AWS4-HMAC-SHA256 Credential=${AKID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

// 公开地址 HEAD 探测（无需签名），返回状态与尺寸
async function probePublic(url) {
  try {
    const r = await fetch(url, { method: "HEAD" });
    const len = r.headers.get("content-length");
    return { status: r.status, size: len ? parseInt(len, 10) : null };
  } catch {
    return { status: "ERR", size: null };
  }
}

async function uploadOne(f) {
  const body = fs.readFileSync(f.abs);
  const url = `${S3_ENDPOINT}/${BUCKET}/${f.key}`;
  const headers = signHeaders({
    method: "PUT",
    url,
    body,
    contentType: "image/webp",
  });
  const r = await fetch(url, { method: "PUT", headers, body });
  return { ok: r.status >= 200 && r.status < 300, status: r.status };
}

// ---------- 主流程：按尺寸增量上传 ----------
// 只在「远端缺失」或「远端尺寸 ≠ 本地预览尺寸」时上传（覆盖陈旧/假预览）。
// 远端存在且尺寸完全一致 → 判定为已是正确版本，跳过。
const toUpload = [];
let skipUpToDate = 0;
let i = 0;
console.log("探测 R2 已有预览（按尺寸比对）...");
for (const f of files) {
  process.stdout.write(`\r  探测 ${++i}/${files.length}`);
  const p = await probePublic(f.publicUrl);
  const upToDate = p.status === 200 && p.size !== null && p.size === f.localSize;
  if (upToDate) skipUpToDate++;
  else toUpload.push(f);
}
console.log(`\n需上传：${toUpload.length} 张（跳过已是最新 ${skipUpToDate} 张）`);

if (toUpload.length === 0) {
  console.log("全部预览已是最新，无需上传。");
  process.exit(0);
}

let done = 0;
let failed = 0;
const failures = [];
const CONC = 8;
let idx = 0;
async function worker() {
  while (idx < toUpload.length) {
    const n = idx++;
    const f = toUpload[n];
    try {
      const r = await uploadOne(f);
      if (r.ok) {
        process.stdout.write(`\r  ✅ 上传 ${++done}/${toUpload.length}  `);
      } else {
        failed++;
        failures.push({ key: f.key, status: r.status });
        console.log(`\n  ❌ [${r.status}] ${f.key}`);
      }
    } catch (e) {
      failed++;
      failures.push({ key: f.key, err: String(e) });
      console.log(`\n  ❌ ERR ${f.key}: ${e.message ?? e}`);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

console.log(`\n完成：成功 ${done}，失败 ${failed}`);
if (failures.length) {
  console.log("失败清单：");
  for (const f of failures) console.log("  -", f.key, f.status ?? f.err);
  process.exit(2);
}
