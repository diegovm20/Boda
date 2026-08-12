/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Evita EMFILE ("too many open files") en macOS: el watcher nativo
  // se queda sin file descriptors y corrompe los chunks de webpack.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },
};

export default nextConfig;
