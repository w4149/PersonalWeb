import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewableImg } from "@personal-sites/shared";
import { DetailImageContext } from "@/components/detail-image-context";
import { Navigation } from "@/components/navigation";
import { ViewsCarousel } from "@/components/views-carousel";
import { T } from "@/components/i18n-text";
import {
  exhibitions,
  getExhibition,
  getExhibitionWorks,
} from "@/lib/works-data";
import { toPreview } from "@/lib/preview";
import { ExhibitionIntro } from "./exhibition-intro";
import { ScrollRestorer } from "./scroll-restorer";

const TITLE_FONT =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export function generateStaticParams() {
  return exhibitions.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibition = getExhibition(slug);
  if (!exhibition) return {};
  return {
    title: `${exhibition.title} | Xie Yike`,
    description: `${exhibition.title} exhibition by Xie Yike.`,
  };
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exhibition = getExhibition(slug);

  if (!exhibition) {
    notFound();
  }

  const works = getExhibitionWorks(exhibition);

  return (
    <main className="min-h-screen bg-white">
      <ScrollRestorer slug={exhibition.slug} />
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      <DetailImageContext>
        {/* 顶部全宽封面图，等比例 */}
        <div className="w-full bg-gray-100 relative">
          <PreviewableImg
            src={exhibition.coverImage}
            alt={exhibition.title}
            className="w-full object-cover"
            style={{ aspectRatio: "16 / 9" }}
          />
        </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-12 md:py-16">
        {/* 基础信息（居中） */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: TITLE_FONT }}
          >
            {exhibition.title}
          </h1>
          <p className="text-sm text-gray-500 mb-1 tracking-wide">
            {exhibition.time}
          </p>
          <p className="text-base text-gray-700">{exhibition.address}</p>
        </div>

        {/* 分割线 */}
        <hr className="border-gray-200 mb-12" />

        {/* Views 现场图片灯箱 */}
        <ViewsCarousel views={exhibition.views} />

        {/* 介绍 / 前言 */}
        <ExhibitionIntro
          description={exhibition.description}
          fullDescription={exhibition.fullDescription}
          descriptionEn={exhibition.descriptionEn}
          fullDescriptionEn={exhibition.fullDescriptionEn}
        />

        {/* 分割线 */}
        <hr className="border-gray-200 my-12" />

        {/* 作品列表（Grid 视图） */}
        {works.length > 0 && (
          <section>
            <h2
              className="text-2xl sm:text-3xl font-medium text-gray-900 mb-8"
              style={{ fontFamily: TITLE_FONT }}
            >
              <T k="ui.featuredWorks" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {works.map((work, index) => {
                const ref = exhibition.works[index];
                const href = `/whole-works/${ref}?from=exhibition:${exhibition.slug}`;
                return (
                  <div key={work.slug} className="block">
                    <div className="w-full bg-white overflow-hidden">
                      <img
                        src={toPreview(work.thumbnail)}
                        alt={work.title}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                    </div>
                    <div className="mt-4">
                      <h3
                        className="text-base font-medium italic text-gray-900"
                        style={{ fontFamily: TITLE_FONT }}
                      >
                        {work.displayTitle || work.title}
                      </h3>
                      {work.year && (
                        <p className="text-sm text-gray-600 mt-1">
                          {work.year}
                        </p>
                      )}
                      {href && (
                        <Link
                          href={href}
                          prefetch={false}
                          className="inline-block mt-3 px-4 py-1.5 border border-gray-300 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <T k="ui.learnMore" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 返回 */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link
            href="/#exhibitions"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <T k="ui.backToExhibitions" />
          </Link>
        </div>
      </div>
      </DetailImageContext>
    </main>
  );
}
