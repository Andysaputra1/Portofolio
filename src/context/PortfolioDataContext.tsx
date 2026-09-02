/* The provider and its consumer hook intentionally share this module. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { orgExperiences, projects } from "../loaders/portfolioData";
import type { OrgExp, Project } from "../types/portfolio";
import rawSkills from "../data/skills.json";
import type { Skill } from "../types/portfolio";
import defaultCvUrl from "../assets/Andy Saputra_CV3 NewVersion.pdf";

type PortfolioData = {
  projects: Project[];
  organizations: OrgExp[];
  skills: Skill[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: "up" | "down") => void;
  addOrganization: (organization: OrgExp) => void;
  updateOrganization: (organization: OrgExp) => void;
  removeOrganization: (id: number) => void;
  moveOrganization: (id: number, direction: "up" | "down") => void;
  replaceProjects: (items: Project[]) => void;
  replaceOrganizations: (items: OrgExp[]) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  moveSkill: (id: string, direction: "up" | "down") => void;
  replaceSkills: (items: Skill[]) => void;
  cvUrl: string;
  cvName: string;
  replaceCv: (file: File) => void;
};

const PortfolioDataContext = createContext<PortfolioData | null>(null);

export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const [currentProjects, setCurrentProjects] = useState<Project[]>(projects);
  const [currentOrganizations, setCurrentOrganizations] = useState<OrgExp[]>(orgExperiences);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>(rawSkills as Skill[]);
  const [cvUrl, setCvUrl] = useState(defaultCvUrl);
  const [cvName, setCvName] = useState("Andy Saputra_CV3 NewVersion.pdf");

  const moveItem = <T extends { id: string | number }>(items: T[], id: T["id"], direction: "up" | "down") => {
    const from = items.findIndex((item) => item.id === id);
    const to = from + (direction === "up" ? -1 : 1);
    if (from < 0 || to < 0 || to >= items.length) return items;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    return next;
  };

  const value = useMemo<PortfolioData>(() => ({
    projects: currentProjects,
    organizations: currentOrganizations,
    skills: currentSkills,
    addProject: (project) => setCurrentProjects((items) => [...items, project]),
    updateProject: (project) => setCurrentProjects((items) => items.map((item) => item.id === project.id ? project : item)),
    removeProject: (id) => setCurrentProjects((items) => items.filter((item) => item.id !== id)),
    moveProject: (id, direction) => setCurrentProjects((items) => moveItem(items, id, direction)),
    addOrganization: (organization) =>
      setCurrentOrganizations((items) => [...items, organization]),
    updateOrganization: (organization) => setCurrentOrganizations((items) => items.map((item) => item.id === organization.id ? organization : item)),
    removeOrganization: (id) =>
      setCurrentOrganizations((items) => items.filter((item) => item.id !== id)),
    moveOrganization: (id, direction) => setCurrentOrganizations((items) => moveItem(items, id, direction)),
    replaceProjects: setCurrentProjects,
    replaceOrganizations: setCurrentOrganizations,
    addSkill: (skill) => setCurrentSkills((items) => [...items, skill]),
    updateSkill: (skill) => setCurrentSkills((items) => items.map((item) => item.id === skill.id ? skill : item)),
    removeSkill: (id) => setCurrentSkills((items) => items.filter((item) => item.id !== id)),
    moveSkill: (id, direction) => setCurrentSkills((items) => moveItem(items, id, direction)),
    replaceSkills: setCurrentSkills,
    cvUrl,
    cvName,
    replaceCv: (file) => {
      if (cvUrl.startsWith("blob:")) URL.revokeObjectURL(cvUrl);
      setCvUrl(URL.createObjectURL(file));
      setCvName(file.name);
    },
  }), [currentOrganizations, currentProjects, currentSkills, cvName, cvUrl]);

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used inside PortfolioDataProvider.");
  }
  return context;
}
