const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 경고를 해결하기 위해 빈 구성을 추가합니다.
  turbopack: {},
};

module.exports = withPWA(nextConfig);
