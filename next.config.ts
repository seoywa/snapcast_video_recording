import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {hostname: 'my-snapcast-zone.b-cdn.net', protocol: 'https', pathname: '/**'},
      {hostname: 'lh3.googleusercontent.com', protocol: 'https', pathname: '/**'},
    ]
  }
};

export default nextConfig;
