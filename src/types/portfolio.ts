export type OrgSubRole = { title: string; context?: string; bullets: string[] };
export type OrgExp = { id: number; role?: string; org: string; location?: string; period: string; summary?: string; roles?: OrgSubRole[] };
export type Project = { id: string; title: string; tag: string; stack: string; link: string; image?: string; description: string };
export type Skill = { id: string; name: string; group: "Web Development" | "Programming Languages & Database"; image?: string };
