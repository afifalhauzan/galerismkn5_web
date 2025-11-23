import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MyWebSite',
    short_name: 'MySite',
    description: 'My awesome Next.js PWA',
    start_url: '/', // <--- FIXED: Added this
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any', // <--- FIXED: Added 'any'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any', // <--- FIXED: Added 'any'
      },
    ],
  }
}