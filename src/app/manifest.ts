import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fantasy Stork League',
    short_name: 'Stork Race',
    description: 'The world&apos;s only Fantasy League for stork migration patterns',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any'
      },
    ],
  }
}