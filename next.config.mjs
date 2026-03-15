import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! 위험 !!
    // 프로젝트에 타입 에러가 있어도 빌드를 강제로 진행합니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 검사를 건너뜁니다.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Turbopack 경고를 해결하기 위해 빈 구성을 추가합니다.
    turbopack: {},
  },
};

export default withPWA(nextConfig);
