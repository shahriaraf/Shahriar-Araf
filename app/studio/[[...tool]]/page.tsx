/**
 * Sanity Studio is embedded at /studio
 * Access it at: http://localhost:3000/studio  (dev)
 * Or:          https://yourportfolio.vercel.app/studio  (prod)
 *
 * This route is excluded from static generation so the studio
 * always renders fresh on the client.
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
