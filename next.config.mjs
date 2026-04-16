/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // for allowing fetch data from cloudinary
        port: '',
        pathname: '/**',
        search: ''
      },
    ],
  },
};

export default nextConfig;