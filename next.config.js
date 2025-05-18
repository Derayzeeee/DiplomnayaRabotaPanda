/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com'],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            "fs": false,
            "path": false,
        };
        return config;
    },
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
              { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
            ],
          },
        ];
      },
};

module.exports = nextConfig;