import { skillGroups, type OrgExp, type Project, type Skill } from '../types/portfolio';

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string';
const optionalText = (value: unknown) => value === undefined || text(value);
export const safeLink = (value: unknown) => text(value) && /^https?:\/\//i.test(value);
export const safeImage = (value: unknown) => value === undefined || value === '' || (text(value) && (/^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value) || /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)));

export function validProjects(value: unknown): value is Project[] {
  return Array.isArray(value) && new Set(value.map((x) => x?.id)).size === value.length && value.every((x) => record(x) && text(x.id) && text(x.title) && text(x.tag) && text(x.stack) && text(x.description) && safeLink(x.link) && safeImage(x.image) && optionalText(x.role) && (x.status === undefined || x.status === 'In progress' || x.status === 'Completed'));
}
export function validOrganizations(value: unknown): value is OrgExp[] {
  return Array.isArray(value) && new Set(value.map((x) => x?.id)).size === value.length && value.every((x) => record(x) && typeof x.id === 'number' && Number.isFinite(x.id) && text(x.org) && text(x.period) && [x.role, x.location, x.summary, x.imageCaption].every(optionalText) && safeImage(x.image) && (x.imageLayout === undefined || x.imageLayout === 'original' || x.imageLayout === 'landscape') && (x.roles === undefined || (Array.isArray(x.roles) && x.roles.every((r) => record(r) && text(r.title) && optionalText(r.context) && Array.isArray(r.bullets) && r.bullets.every(text)))));
}
export function validSkills(value: unknown): value is Skill[] {
  return Array.isArray(value) && new Set(value.map((x) => x?.id)).size === value.length && value.every((x) => record(x) && text(x.id) && text(x.name) && skillGroups.some((group) => group === x.group) && safeImage(x.image));
}
