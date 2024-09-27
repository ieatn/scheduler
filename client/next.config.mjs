/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,  // Ignores ESLint warnings/errors during the build
      },
      typescript: {
        ignoreBuildErrors: true,   // Ignores TypeScript errors during the build
      },
};

export default nextConfig;
