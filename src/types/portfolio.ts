export type OrgSubRole = { title: string; context?: string; bullets: string[] };
export type OrgExp = { id: number; role?: string; org: string; location?: string; period: string; summary?: string; roles?: OrgSubRole[]; image?: string; imageCaption?: string; imageLayout?: 'original' | 'landscape' };
export type Project = { id: string; title: string; tag: string; stack: string; link: string; image?: string; description: string; status?: "In progress" | "Completed"; role?: string };
export const skillGroups = ["Programming Languages", "Frameworks & Libraries", "DevOps & Tools", "Artificial Intelligence"] as const;
export type Skill = { id: string; name: string; group: typeof skillGroups[number]; image?: string };
