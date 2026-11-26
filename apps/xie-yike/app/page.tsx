import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { T } from "@/components/i18n-text";
import { AboutIntroduction } from "@/components/about-introduction";
import { getAboutIntro } from "@/lib/content-loader";
import {
  JustifiedGallery,
  GalleryItem,
} from "@personal-sites/shared";
import {
  projects,
  otherWorks,
  exhibitions,
  getOtherWork,
  R2,
} from "@/lib/works-data";
import { toPreview } from "@/lib/preview";

const TITLE_FONT =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

export default function HomePage() {
  const aboutIntro = getAboutIntro();
  // OTHER WORKS 画廊条目
  const otherWorksItems: GalleryItem[] = otherWorks
    .map((ref) => {
      const work = getOtherWork(ref.slug);
      if (!work) return null;
      return {
        src: work.thumbnail,
        aspectRatio: work.aspectRatio,
        title: work.title,
        displayTitle: work.displayTitle || work.title,
        href: `/other-works/${ref.slug}`,
      } as GalleryItem;
    })
    .filter((item): item is GalleryItem => item !== null);

  return (
    <main className="h-screen overflow-y-auto scroll-smooth snap-y snap-proximity bg-white">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      {/* ============================================================
          SECTION 1 · HOME
      ============================================================ */}
      <section
        id="home"
        className="snap-start min-h-screen w-full relative flex flex-col justify-center items-center px-6 sm:px-8 md:px-16 lg:px-24 py-24 sm:py-20 overflow-hidden bg-black"
      >
        {/* 文字内容 */}
        <div className="max-w-4xl w-full relative z-10 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-white leading-tight uppercase">
            <T k="ui.artistName" />
          </h1>
          <p className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-light">
            <T k="ui.artistRole" />
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 · ABOUT
      ============================================================ */}
      <section id="about" className="snap-start min-h-screen w-full flex items-center justify-center">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
          {/* 艺术家照片 */}
          <div className="flex justify-center mb-10 md:mb-14">
            <Image
              src={toPreview(`${R2}/images/introduction/yike_xie.jpg`)}
              alt="Xie Yike"
              width={2943}
              height={3924}
              sizes="(max-width: 768px) 80vw, 448px"
              className="w-full max-w-md h-auto object-cover"
            />
          </div>
          {/* 简介文字 */}
          <div className="max-w-4xl mx-auto">
            <AboutIntroduction
              zhParagraphs={aboutIntro.zh}
              enParagraphs={aboutIntro.en}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2.5 · BRIDGE（ABOUT → EXHIBITIONS 过渡图）
      ============================================================ */}
      <section className="snap-start h-[50vh] w-full relative overflow-hidden bg-gray-100">
        <div className="absolute inset-y-0" style={{ left: "-12.5%", width: "125%" }}>
          <Image
            src={toPreview(`${R2}/images/bridges/bridge-to-exhibition.jpg`)}
            alt=""
            fill
            sizes="125vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* ============================================================
          SECTION 3 · EXHIBITIONS（每个展览占一页）
      ============================================================ */}
      {exhibitions.map((exhibition, index) => (
        <section
          key={exhibition.slug}
          id={index === 0 ? "exhibitions" : undefined}
          className="snap-start min-h-screen w-full flex items-center justify-center"
        >
          <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
            {index === 0 && (
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-gray-900 mb-12 md:mb-16"
                style={{ fontFamily: TITLE_FONT }}
              >
                <T k="section.exhibitions" />
              </h1>
            )}
            <Link
              href={`/exhibitions/${exhibition.slug}`}
              className="block group flex flex-col items-center text-center"
            >
              <div
                className="relative w-full max-w-4xl bg-gray-100 overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={toPreview(exhibition.coverImage)}
                  alt={exhibition.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-1">Xie Yike</p>
                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-medium italic text-gray-900 mb-2 group-hover:text-gray-600 transition-colors"
                  style={{ fontFamily: TITLE_FONT }}
                >
                  {exhibition.title}
                </h3>
                <p className="text-sm text-gray-600 mb-0.5">{exhibition.time}</p>
                <p className="text-sm text-gray-600">{exhibition.address}</p>
              </div>
            </Link>
          </div>
        </section>
      ))}

      {/* ============================================================
          SECTION 4 · PROJECTS（每个项目占一页）
      ============================================================ */}
      {projects.map((project, index) => (
        <section
          key={project.slug}
          id={index === 0 ? "projects" : undefined}
          className="snap-start min-h-screen w-full flex items-center justify-center"
        >
          <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
            {index === 0 && (
              <h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-gray-900 mb-12 md:mb-16"
                style={{ fontFamily: TITLE_FONT }}
              >
                <T k="section.projects" />
              </h1>
            )}
            <Link
              href={`/projects/${project.slug}`}
              className="block group flex flex-col items-center"
            >
              <div
                className="relative w-full max-w-4xl bg-gray-100 overflow-hidden"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src={toPreview(project.coverImage)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3
                className="mt-6 text-xl sm:text-2xl md:text-3xl font-medium italic text-gray-900 group-hover:text-gray-600 transition-colors"
                style={{ fontFamily: TITLE_FONT }}
              >
                {project.title}
              </h3>
            </Link>
          </div>
        </section>
      ))}

      {/* ============================================================
          SECTION 5 · OTHER WORKS（暂时隐藏，恢复时把下方 false 改为 true）
      ============================================================ */}
      {false && (
      <section id="other-works" className="snap-start min-h-screen w-full">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-gray-900 mb-12 md:mb-16"
            style={{ fontFamily: TITLE_FONT }}
          >
            <T k="section.otherWorks" />
          </h1>

          {otherWorksItems.length > 0 ? (
            <Suspense fallback={null}>
              <JustifiedGallery
                items={otherWorksItems}
                columns={{ base: 1, sm: 2, lg: 3 }}
                minHeight={120}
                maxHeight={360}
                showTitle
              />
            </Suspense>
          ) : (
            <p className="text-lg text-gray-500 italic">
              Other works will be listed here.
            </p>
          )}
        </div>
      </section>
      )}

      {/* ============================================================
          SECTION 6 · NEWS（仅显示 coming soon）
      ============================================================ */}
      <section id="news" className="snap-start min-h-screen w-full flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-gray-500 text-base sm:text-lg md:text-xl italic">
            <T k="ui.newsComingSoon" />
          </p>
        </div>
      </section>
    </main>
  );
}


