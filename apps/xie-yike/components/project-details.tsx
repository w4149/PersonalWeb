"use client";

import { useState, type ReactNode } from "react";
import { PreviewableImg } from "@personal-sites/shared";
import type { DetailRow } from "@/lib/works-data";
import { useLanguage } from "@/lib/i18n";

const TITLE_FONT =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

/** 带原始序号的详情行（用于保持左右交替排列） */
interface IndexedRow extends DetailRow {
  originalIndex: number;
}

interface DetailGroup {
  /** level=1 的主项 */
  header: IndexedRow;
  /** 紧随其后的 level=2 子项 */
  children: IndexedRow[];
}

/**
 * 按 level 分组：
 * - level=0 直接丢弃
 * - level=1 作为分组主项
 * - 连续的 level=2 归入上一个 level=1 分组
 */
function buildGroups(details: DetailRow[]): DetailGroup[] {
  const groups: DetailGroup[] = [];
  let current: DetailGroup | null = null;
  details.forEach((row, i) => {
    const level = row.level ?? 1;
    if (level === 0) return;
    const indexed: IndexedRow = { ...row, originalIndex: i };
    if (level === 1) {
      current = { header: indexed, children: [] };
      groups.push(current);
    } else if (level === 2) {
      current?.children.push(indexed);
    }
  });
  return groups;
}

export function ProjectDetails({ details }: { details: DetailRow[] }) {
  const { lang, t } = useLanguage();
  // 以 header 的 originalIndex 为 key 记录展开状态
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (!details || details.length === 0) {
    return (
      <section className="py-12">
        <p className="text-center text-gray-400 text-sm">
          {t("ui.detailsEmpty")}
        </p>
      </section>
    );
  }

  const groups = buildGroups(details);

  const toggle = (idx: number) =>
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));

  /** 渲染附加图片：2 张一行，左右两列都是图 */
  const renderExtraImages = (images: string[]): ReactNode => {
    const rows: ReactNode[] = [];
    for (let i = 0; i < images.length; i += 2) {
      rows.push(
        <div
          key={`extra-${i}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12"
        >
          <div>
            <PreviewableImg
              src={images[i]}
              alt=""
              className="w-full h-auto block"
              loading="lazy"
              // 附加图默认只显预览（原图常达 20-40MB），点击/按钮才就地加载原图
              showViewOriginal={true}
              autoLoadOriginal={false}
            />
          </div>
          {images[i + 1] && (
            <div>
              <PreviewableImg
                src={images[i + 1]}
                alt=""
                className="w-full h-auto block"
                loading="lazy"
                // 附加图默认只显预览（原图常达 20-40MB），点击/按钮才就地加载原图
                showViewOriginal={true}
                autoLoadOriginal={false}
              />
            </div>
          )}
        </div>
      );
    }
    return rows;
  };

  /** 渲染单条详情行（主项/子项通用），footer 可放展开按钮 */
  const renderRow = (row: IndexedRow, isEven: boolean, footer?: ReactNode) => {
    const useEn = lang === "en" && row.titleEn;
    const title = useEn ? row.titleEn! : row.title;
    const text = useEn ? row.textEn ?? row.text : row.text;

    return (
      <div
        key={row.originalIndex}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center"
      >
        {row.image && (
          <div className={isEven ? "md:order-2" : "md:order-1"}>
            <PreviewableImg
              src={row.image}
              alt={title || `detail-${row.originalIndex + 1}`}
              className="w-full h-auto block"
              loading="lazy"
              showViewOriginal={false}
            />
          </div>
        )}
        <div className={isEven ? "md:order-1" : "md:order-2"}>
          {title && (
            <h3
              className="text-xl font-medium text-gray-900 mb-4"
              style={{ fontFamily: TITLE_FONT }}
            >
              {title}
            </h3>
          )}
          {text && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          )}
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-12 md:gap-20">
      {groups.map((group, groupIndex) => {
        const isOpen = !!expanded[group.header.originalIndex];
        const hasChildren = group.children.length > 0;
        const extraImages = group.header.extraImages ?? [];
        const hasExtra = extraImages.length > 0;
        // 有 level=2 子项 或 有附加图片时，显示「了解更多」
        const hasExpandable = hasChildren || hasExtra;
        // level 1 按组序号左右交替；level 2 与所属 level 1 同侧
        const isEven = groupIndex % 2 === 1;

        const button = hasExpandable ? (
          <button
            onClick={() => toggle(group.header.originalIndex)}
            className="text-sm text-gray-900 border-b border-gray-400 hover:border-gray-900 pb-0.5 transition-colors"
          >
            {isOpen ? t("ui.readLess") : t("ui.learnMore")}
          </button>
        ) : undefined;

        return (
          <div key={group.header.originalIndex}>
            {renderRow(group.header, isEven, button)}
            {isOpen && hasExpandable && (
              <div className="mt-12 md:mt-20 flex flex-col gap-12 md:gap-20">
                {hasExtra && (
                  <div className="flex flex-col gap-6 md:gap-12">
                    {renderExtraImages(extraImages)}
                  </div>
                )}
                {group.children.map((child) => renderRow(child, isEven))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
