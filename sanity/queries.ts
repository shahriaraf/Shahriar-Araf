import { PortableTextBlock } from 'sanity';
import { client } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SanityImageRef = {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
}

export type WebProject = {
  _id: string
  name: string
  category: 'web'
  description: PortableTextBlock[]; // ← was string
  image: SanityImageRef
  technologies: string[]
  liveLink: string
  githubLink: string
  order: number
}

export type AppProject = {
  _id: string
  name: string
  category: 'app'
  description: string
  image: SanityImageRef
  technologies: string[]
  githubLink: string
  apkLink: string
  order: number
}

export type Project = WebProject | AppProject

export type Skill = {
  _id: string
  name: string
  category: 'frontend' | 'backend' | 'devops'
  logo: SanityImageRef
  color: string
  order: number
}

export type AboutData = {
  bio: string
  bio2?: string
  yearsExperience?: string
  projectsCompleted?: string
  aboutImage?: SanityImageRef
  cv?: { asset: { url: string } }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PROJECT_FIELDS = `
  _id,
  name,
  category,
  description,
  image,
  technologies,
  liveLink,
  githubLink,
  apkLink,
  order
`

const SKILL_FIELDS = `
  _id,
  name,
  category,
  logo,
  color,
  order
`

const ABOUT_FIELDS = `
  bio,
  bio2,
  yearsExperience,
  projectsCompleted,
  aboutImage,
  "cv": cv { asset-> { url } }
`

export async function getWebProjects(): Promise<WebProject[]> {
  return client.fetch(
    `*[_type == "project" && category == "web"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}

export async function getAppProjects(): Promise<AppProject[]> {
  return client.fetch(
    `*[_type == "project" && category == "app"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`
  )
}

export async function getSkills(): Promise<Skill[]> {
  return client.fetch(
    `*[_type == "skill"] | order(order asc) { ${SKILL_FIELDS} }`
  )
}

export async function getAbout(): Promise<AboutData | null> {
  const results = await client.fetch(
    `*[_type == "about" && _id == "about-singleton"][0] { ${ABOUT_FIELDS} }`
  )
  return results ?? null
}
