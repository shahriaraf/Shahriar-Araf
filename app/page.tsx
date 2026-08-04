import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import RadialMenu from "@/components/RadialMenu";
import { SectionStack, type PanelConfig } from "@/components/SectionStack";
import { getWebProjects, getAppProjects, getSkills, getAbout } from "@/sanity/queries";

// Banner is the LCP element and stays a static import so it's ready
// immediately. Everything below the fold is dynamically imported so its
// JS (framer-motion variants, @portabletext/react, the Sanity image-url
// builder, emailjs) ships as separate chunks fetched after the critical
// path instead of being parsed/executed up front on every load — that's
// what was showing up as "unused JavaScript" in the initial-load audit.
// ssr stays on (the default) so content, layout, and SEO are unaffected;
// only the client JS is deferred.
const About = dynamic(() => import("@/components/About"));
const Skills = dynamic(() => import("@/components/Skills"));
const Projects = dynamic(() => import("@/components/Projects"));
const Contact = dynamic(() => import("@/components/Contact"));

export const revalidate = 60;

export default async function Home() {
  const [webProjects, appProjects, skills, about] = await Promise.all([
    getWebProjects(),
    getAppProjects(),
    getSkills(),
    getAbout(),
  ]);


  const panels: PanelConfig[] = [
    {
      id      : "home",
      element : <Banner />,
      bgColor : "#151515",
    },
    {
      id      : "about",
      element : <About about={about} />,
      bgColor : "#0d0d0d",
    },
    {
      id      : "skills",
      element : <Skills skills={skills} />,
      bgColor : "#151515",
    },
    {
      id       : "projects",
      element  : <Projects webProjects={webProjects} appProjects={appProjects} />,
      bgColor  : "#151515",
    },
    {
      id      : "contact",
      element : <Contact />,
      bgColor : "#151515",
    },
  ];

  return (
    <main className="bg-black font-code">
      <RadialMenu />
      <SectionStack panels={panels} />
    </main>
  );
}
