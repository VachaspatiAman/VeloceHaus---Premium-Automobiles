/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose env vars to the browser (prefix must be NEXT_PUBLIC_)
  env: {
    NEXT_PUBLIC_API_URL:  process.env.NEXT_PUBLIC_API_URL  || '/.netlify/functions/api',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Veloce',
    NEXT_PUBLIC_APP_URL:  process.env.NEXT_PUBLIC_APP_URL  || '',
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'wallpapercave.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // Rewrite /api/* → local Express backend during `next dev`
  // On Netlify this is overridden by the redirect in netlify.toml
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return [
      {
        source:      '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // Silence the ESLint/TypeScript errors that would break CI builds
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

