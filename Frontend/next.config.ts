import type { NextConfig } from 'next';

/**
 * Host de l'API à autoriser pour `next/image`, déduit de
 * NEXT_PUBLIC_API_URL. Couvre le cas où l'API sert encore elle-même des
 * fichiers depuis `/media/**` (développement local, ou déploiement sans
 * Vercel Blob) ; ce n'est plus nécessaire une fois les photos dans Vercel
 * Blob (couvert séparément ci-dessous), mais ne coûte rien à garder.
 */
function hostApi(): { protocol: 'http' | 'https'; hostname: string; port?: string; pathname: string } | null {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return null;

  try {
    const u = new URL(url);
    const motif: { protocol: 'http' | 'https'; hostname: string; port?: string; pathname: string } = {
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      pathname: '/media/**',
    };
    if (u.port) motif.port = u.port;
    return motif;
  } catch {
    return null;
  }
}

const depuisApi = hostApi();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Formats servis par ordre de préférence (cf. cahier des charges §4.2)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [400, 800, 1200, 1920, 2560, 3840],
    imageSizes: [64, 128, 256, 384],
    // Toute valeur passée en `quality` doit figurer ici, sinon l'optimiseur
    // répond 400. 75 est la valeur par défaut de Next.
    qualities: [75, 88, 90, 92, 95, 100],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    /**
     * Les photographies téléversées depuis le back-office sont servies par
     * l'API (développement local), ou directement par Vercel Blob (§20.1,
     * production). `next/image` refuse toute origine externe non déclarée
     * — c'est ce qui empêche un tiers de faire optimiser ses images par
     * votre serveur.
     */
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/media/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4000', pathname: '/media/**' },
      ...(depuisApi ? [depuisApi] : []),
      // Vercel Blob : domaine public de tout store connecté à un projet.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['motion', 'gsap'],
  },
};

export default nextConfig;
