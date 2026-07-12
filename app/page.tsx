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