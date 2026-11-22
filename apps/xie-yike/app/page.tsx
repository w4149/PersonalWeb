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
        className="snap-start min-h-screen w-full relative flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24 py-24 sm:py-20 overflow-hidden"
      >
        {/* 背景图（宽度中间 80%，高度中间 60%） */}
        <div
          className="absolute"
          style={{ left: "-12.5%", top: "-33.33%", width: "125%", height: "166.67%" }}
        >
          <Image
            src={`${R2}/images/backgrounds/background-1.jpg`}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        {/* 黑色半透明蒙版 */}
        <div className="absolute inset-0 bg-black/40" />

        {/* 文字内容 */}
        <div className="max-w-4xl w-full relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-tight">
            Xie Yike{" "}
            <span className="block sm:inline text-white/70 font-normal text-2xl sm:text-3xl md:text-5xl lg:text-6xl mt-2 sm:mt-0">
              谢一可
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-xl sm:text-2xl md:text-3xl lg:text-4xl italic text-white/80 font-light">
            <T k="ui.artistRole" />
          </p>
          <p className="mt-6 sm:mt-10 max-w-3xl text-base sm:text-base md:text-lg leading-relaxed text-white/90">
            About placeholder. This section will introduce Xie Yike&apos;s
            artistic practice.
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
              src={`${R2}/images/introduction/yike_xie.jpg`}
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
            src={`${R2}/images/bridges/bridge-to-exhibition.jpg`}
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
                  src={exhibition.coverImage}
                  alt={exhibition.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-400 mb-1 tracking-wide">{exhibition.status}</p>
                <p className="text-sm text-gray-500 mb-1">Xie Yike</p>
                <h3
                  className="text-xl sm:text-2xl md:text-3xl font-medium italic text-gray-900 mb-2 group-hover:text-gray-600 transition-colors"
                  style={{ fontFamily: TITLE_FONT }}
                >
                  {exhibition.title}
                </h3>
                <p className="text-sm text-gray-600 mb-0.5">{exhibition.dateRange}</p>
                <p className="text-sm text-gray-600">{exhibition.location}</p>
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
                  src={project.coverImage}
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
          SECTION 5 · OTHER WORKS
      ============================================================ */}
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

      {/* ============================================================
          SECTION 6 · NEWS
      ============================================================ */}
      <section id="news" className="snap-start min-h-screen w-full">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-gray-900 mb-12 md:mb-16"
            style={{ fontFamily: TITLE_FONT }}
          >
            <T k="section.news" />
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            <T k="ui.newsComingSoon" />
          </p>
        </div>
      </section>
    </main>
  );
}


