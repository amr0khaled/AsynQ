import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
              "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig;
