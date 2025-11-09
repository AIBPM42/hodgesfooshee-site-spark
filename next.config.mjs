/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore TypeScript errors in supabase/functions (Deno code)
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    // Exclude supabase functions from webpack compilation
    config.externals = config.externals || [];
    config.externals.push({
      './supabase/functions': 'commonjs ./supabase/functions',
    });
    return config;
  },
}

export default nextConfig
