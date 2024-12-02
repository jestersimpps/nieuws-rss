import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'static.hbvl.be',
      'images.vrt.be',
      'www.demorgen.be',
      'www.hln.be',
      'www.standaard.be',
      'static.standaard.be'
    ],
  },
};

export default nextConfig;
