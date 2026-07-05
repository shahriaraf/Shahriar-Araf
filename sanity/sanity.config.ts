import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// ─── Replace these with your real values from sanity.io/manage ───────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  name: 'araf-portfolio',
  title: 'Araf Portfolio CMS',
  projectId,
  dataset,
  // Without this, NextStudio's internal router doesn't know it's mounted
  // under /studio — the moment you navigate inside Studio (opening a
  // document, clicking the structure tree), its router rewrites the URL to
  // a bare path like /structure/skill instead of /studio/structure/skill.
  // That broke AppShell's pathname?.startsWith("/studio") check after the
  // very first screen, which is why Lenis + the custom cursor kept
  // remounting on top of Studio and blocking its native scroll.
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — About page
            S.listItem()
              .title('About & Profile')
              .id('about')
              .child(
                S.document()
                  .schemaType('about')
                  .documentId('about-singleton')
              ),
            S.divider(),
            // Regular list documents
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('skill').title('Skills'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})