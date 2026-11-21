import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 读取 CSV 文件并解析为二维数组。
 * - 使用 GBK 解码（Excel 在中文 Windows 下默认保存为 GBK）
 * - 支持双引号包裹的字段，字段内可包含逗号、换行
 * - 字段内的双引号以 "" 转义
 *
 * 仅在服务端使用（依赖 node:fs）。
 */
export function readCsv(relativePath: string): string[][] {
  const fullPath = join(process.cwd(), relativePath);
  const buffer = readFileSync(fullPath);
  const text = new TextDecoder("gbk").decode(buffer);
  return parseCsv(text);
}

/**
 * 解析 CSV 文本为二维数组。
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        // 连续两个双引号表示转义的双引号
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }

    // 未在引号内
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }

  // 处理最后一行（文件可能不以换行结尾）
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // 移除完全为空的行
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}
