export type ExperienceProject = { id: string; title: string; subtitle: string; description: string; image?: string; stack: string[] };
export type OrgSubRole = { title: string; context?: string; bullets: string[] };
export type OrgExp = { id: number; role?: string; org: string; location?: string; period: string; summary?: string; stack?: string[]; projects?: ExperienceProject[]; roles?: OrgSubRole[]; image?: string; imageCaption?: string; imageLayout?: 'original' | 'landscape' };
export type AIProjectDetails = { focus: string; models: string; approach: string; output: string; evaluation: string };
export type Project = { id: string; title: string; tag: string; categories?: string[]; stack: string; link: string; image?: string; description: string; status?: "In progress" | "Completed"; role?: string; ai?: AIProjectDetails };
export const projectCategories = (project: Project) => [...new Set([project.tag, ...(project.categories ?? [])].filter(Boolean))];
export const skillGroups = ["Languages & Web Foundations", "Frameworks & Libraries", "Backend & Developer Tools", "AI & Machine Learning"] as const;
export type Skill = { id: string; name: string; group: typeof skillGroups[number]; image?: string };
