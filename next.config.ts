import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  // Turbopack 경고를 해결하기 위해 빈 구성을 추가합니다.
  // @ts-ignore
  turbopack: {},
};

export default withPWA(nextConfig);
