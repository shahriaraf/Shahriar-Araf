import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // cache at CDN edge; set false during development if you want instant updates
})

// ─── Image URL helper ─────────────────────────────────────────────────────────
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Typed helpers for file assets ───────────────────────────────────────────
export function fileUrl(asset?: { asset?: { url?: string } }): string | null {
  return asset?.asset?.url ?? null
}
