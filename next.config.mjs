export default /** @type {import('next').NextConfig} */ ({
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
});
