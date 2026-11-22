/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // @personal-sites/shared 是 workspace 源码包（TS/TSX）。Vercel 上 npm ci 会建立
  // node_modules/@personal-sites/shared 符号链接，Next.js 默认不编译 node_modules 中的包，
  // 会导致 TS/JSX 语法报 Module parse failed。显式声明 transpile 以保证本地与 Vercel 行为一致。
  transpilePackages: ["@personal-sites/shared"],
  // content/ 目录下的 CSV 路径是动态构造的，需要显式声明以确保构建时被包含
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
