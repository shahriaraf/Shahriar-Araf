import About from "@/components/About";
import Banner from "@/components/Banner";
import Contact from "@/components/Contact";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import RadialMenu from "@/components/RadialMenu";
import { SectionStack, type PanelConfig } from "@/components/SectionStack";
import { getWebProjects, getAppProjects, getSkills, getAbout } from "@/sanity/queries";

export const revalidate = 60;

export default async function Home() {
  const [webProjects, appProjects, skills, about] = await Promise.all([
    getWebProjects(),
    getAppProjects(),
    getSkills(),
    getAbout(),
  ]);

  // Projects panel needs to be N viewports tall so cards can flip on scroll.
  // 1 viewport per project (minimum 1).
  const maxProjects  = Math.max(webProjects.length || 1, appProjects.length || 1, 1);
  const projectsVh   = Math.max(1, maxProjects); // e.g. 3 projects → 3 viewports tall

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
      heightVh : projectsVh,   // ← tall panel, opts out of pinning
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