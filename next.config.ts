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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
              "style-src 'self' 'unsafe-inline'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig;
