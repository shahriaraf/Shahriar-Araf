import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio (Paragraph 1)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio2',
      title: 'Bio (Paragraph 2)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'string',
      description: 'e.g. "03+"',
    }),
    defineField({
      name: 'projectsCompleted',
      title: 'Projects Completed',
      type: 'string',
      description: 'e.g. "25+"',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cv',
      title: 'CV / Resume (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      description: 'Upload your latest CV here — the download button will always serve this file',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About / Profile' }
    },
  },
})
